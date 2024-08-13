import { TransactionQrRequest } from '../dtos/request/transaction-request';
import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { decryptData, encryptData } from '../helpers/encryption';
import { Validation } from '../validators';
import { TransactionValidation } from '../validators/transaction-validation';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import { EnumMutationType } from '../enums/mutation-type-enum';
import {
  toTransactionResponse,
  TransactionResponse
} from '../dtos/response/transaction-response';
import { MutationModel } from '../models/MutattionModel';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { EnumTransactionPurpose } from '../enums/transaction-purpose-enum';
import { UserModel } from '../models/UserModel';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

export class QrService {
  static async transferQr(
    request: TransactionQrRequest
  ): Promise<TransactionResponse> {
    const transactionRequest = Validation.validate(
      TransactionValidation.QR,
      request
    );
    const decryptedData = decryptData(request.key, process.env.QR_SECRET_KEY!);
    const data = JSON.parse(decryptedData);
    const result = await MutationModel.transaction(async (trx) => {
      const account = await UserModel.query(trx)
        .findById(data.account_id)
        .forUpdate()
        .throwIfNotFound();

      const user = await UserModel.query(trx)
        .findById(request.user.id)
        .forUpdate()
        .throwIfNotFound();

      if (user.balance < transactionRequest.amount) {
        throw new ResponseError(400, 'Saldo tidak mencukupi');
      }

      user.balance -= transactionRequest.amount;
      await user.$query(trx).patch({ balance: user.balance });

      account.balance += transactionRequest.amount;
      await account.$query(trx).patch({ balance: account.balance });

      const debitTransaction = await MutationModel.query(trx).insert({
        id: uuidv4(),
        amount: transactionRequest.amount,
        mutation_type: EnumMutationType.TRANSFER,
        description: transactionRequest.description,
        account_number: account.account_number,
        user_id: request.user.id,
        full_name: account.full_name,
        transaction_purpose: EnumTransactionPurpose.OTHER,
        transaction_type: EnumTransactionType.CREDIT,
        created_at: new Date(Date.now())
      });

      await MutationModel.query(trx).insert({
        id: uuidv4(),
        amount: transactionRequest.amount,
        mutation_type: EnumMutationType.TRANSFER,
        description: transactionRequest.description,
        account_number: request.user.account_number,
        user_id: data.account_id,
        full_name: request.user.full_name,
        transaction_purpose: EnumTransactionPurpose.OTHER,
        transaction_type: EnumTransactionType.DEBIT
      });

      return debitTransaction;
    });

    return toTransactionResponse(result);
  }

  static async generateQrCode(req: UserRequest): Promise<string> {
    const account = req.user!;
    const data = JSON.stringify({
      account_id: account.id,
      account_number: account.account_number
    });
    const encryptedData = encryptData(data, process.env.QR_SECRET_KEY!);
    const qrCode = await QRCode.toDataURL(encryptedData);
    return qrCode;
  }
}
