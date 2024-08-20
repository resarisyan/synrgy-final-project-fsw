import { TransactionQrRequest } from '../dtos/request/transaction-request';
import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { decryptData } from '../helpers/encryption';
import { generateChecksum } from '../helpers/generateChecksum';
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
import { QrisModel } from '../models/QrisModel';
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
        transaction_type: EnumTransactionType.DEBIT,
        created_at: new Date(Date.now())
      });

      return debitTransaction;
    });

    return toTransactionResponse(result);
  }

  static async generateQrCode(req: UserRequest): Promise<string> {
    const account = req.user!;

    const userId = account.id;

    let qrType = '11';
    const qrisVersion = '01';
    const merchantDomain = '0010ME.RUPIAPP';
    const merchantCategoryCode = '0000';
    const currencyCode = '360';
    const merchantCountryCode = 'ID';
    const fullName = account.full_name;
    const merchantCity = 'Jakarta';
    const merchantPostalCode = '12345';
    const amount = req.body.amount || 0;

    const transactionIdPrefix = '05400804DMCT';
    const uuidTD = uuidv4().replace(/-/g, '') + '0714';
    const accountNumber = account.account_number;
    const accountNumberTag = '00' + accountNumber.length;
    const transactionId =
      transactionIdPrefix + uuidTD + accountNumber + accountNumberTag;

    let qrDataPayload = '';

    if (amount == 0) {
      qrType = '11'; // static qr
      qrDataPayload = [
        '00' + qrisVersion.length.toString().padStart(2, '0') + qrisVersion,
        '01' + qrType.length.toString().padStart(2, '0') + qrType,
        '40' +
          merchantDomain.length.toString().padStart(2, '0') +
          merchantDomain,
        '52' +
          merchantCategoryCode.length.toString().padStart(2, '0') +
          merchantCategoryCode,
        '53' + currencyCode.length.toString().padStart(2, '0') + currencyCode,
        '58' +
          merchantCountryCode.length.toString().padStart(2, '0') +
          merchantCountryCode,
        '59' + fullName.length.toString().padStart(2, '0') + fullName,
        '60' + merchantCity.length.toString().padStart(2, '0') + merchantCity,
        '61' +
          merchantPostalCode.length.toString().padStart(2, '0') +
          merchantPostalCode,
        '62' + transactionId.length.toString().padStart(2, '0') + transactionId
      ].join('');
    } else if (amount > 0) {
      qrType = '12'; // dynamic qr
      qrDataPayload = [
        '00' + qrisVersion.length.toString().padStart(2, '0') + qrisVersion,
        '01' + qrType.length.toString().padStart(2, '0') + qrType,
        '40' +
          merchantDomain.length.toString().padStart(2, '0') +
          merchantDomain,
        '52' +
          merchantCategoryCode.length.toString().padStart(2, '0') +
          merchantCategoryCode,
        '53' + currencyCode.length.toString().padStart(2, '0') + currencyCode,
        '54' + amount.toString().length.toString().padStart(2, '0') + amount,
        '58' +
          merchantCountryCode.length.toString().padStart(2, '0') +
          merchantCountryCode,
        '59' + fullName.length.toString().padStart(2, '0') + fullName,
        '60' + merchantCity.length.toString().padStart(2, '0') + merchantCity,
        '61' +
          merchantPostalCode.length.toString().padStart(2, '0') +
          merchantPostalCode,
        '62' + transactionId.length.toString().padStart(2, '0') + transactionId
      ].join('');
    }

    console.log('qrDataPayload:', qrDataPayload);

    const checksum = await generateChecksum(qrDataPayload);
    console.log('checksum:', checksum);

    const checksumFormat =
      '63' + checksum.length.toString().padStart(2, '0') + checksum;

    const qrisFinalPayload = qrDataPayload + checksumFormat;
    console.log('qrisFinalPayload:', qrisFinalPayload);

    await QrisModel.query().insert({
      id: uuidv4(),
      transaction_id: uuidTD,
      expired_at: new Date(Date.now() + 86400000),
      payload: qrisFinalPayload,
      type: 0,
      used: false,
      user_id: userId
    });

    const qrCode = await QRCode.toDataURL(qrisFinalPayload);
    return qrCode;
  }
}
