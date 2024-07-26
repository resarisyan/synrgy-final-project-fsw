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
    const account = await MutationModel.query()
      .findById(data.account_id)
      .throwIfNotFound();

    const result = await MutationModel.transaction(async (trx) => {
      const debitTransaction = await MutationModel.query(trx).insert({
        amount: transactionRequest.amount,
        type: EnumMutationType.TRANSFER_QR,
        description: transactionRequest.description,
        account_number: account.account_number,
        user_id: account.user_id,
        transaction: EnumTransactionType.DEBIT
      });

      await MutationModel.query(trx).insert({
        amount: transactionRequest.amount,
        type: EnumMutationType.TRANSFER_QR,
        description: transactionRequest.description,
        account_number: account.account_number,
        user_id: account.user_id,
        transaction: EnumTransactionType.CREDIT
      });

      return debitTransaction;
    });

    return toTransactionResponse(result);
  }

  static async generateQrCode(req: UserRequest): Promise<string> {
    try {
      const account = req.user!;
      const data = JSON.stringify({
        account_id: account.id,
        account_number: account.account_number
      });
      const encryptedData = encryptData(data, process.env.QR_SECRET_KEY!);
      const qrCode = await QRCode.toDataURL(encryptedData);
      return qrCode;
    } catch (error) {
      throw new ResponseError(500, 'Failed to generate QR code');
    }
  }
}
