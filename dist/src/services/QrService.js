"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrService = void 0;
const generateChecksum_1 = require("../helpers/generateChecksum");
const validators_1 = require("../validators");
const transaction_validation_1 = require("../validators/transaction-validation");
const qrcode_1 = __importDefault(require("qrcode"));
const dotenv_1 = __importDefault(require("dotenv"));
const QrisModel_1 = require("../models/QrisModel");
const uuid_1 = require("uuid");
dotenv_1.default.config();
class QrService {
    // static async transferQr(
    //   request: TransactionQrRequest
    // ): Promise<TransactionResponse> {
    //   const transactionRequest = Validation.validate(
    //     TransactionValidation.QR,
    //     request
    //   );
    //   const decryptedData = decryptData(request.key, process.env.QR_SECRET_KEY!);
    //   const data = JSON.parse(decryptedData);
    //   const result = await MutationModel.transaction(async (trx) => {
    //     const account = await UserModel.query(trx)
    //       .findById(data.account_id)
    //       .forUpdate()
    //       .throwIfNotFound();
    //     const user = await UserModel.query(trx)
    //       .findById(request.user.id)
    //       .forUpdate()
    //       .throwIfNotFound();
    //     if (user.balance < transactionRequest.amount) {
    //       throw new ResponseError(400, 'Saldo tidak mencukupi');
    //     }
    //     user.balance -= transactionRequest.amount;
    //     await user.$query(trx).patch({ balance: user.balance });
    //     account.balance += transactionRequest.amount;
    //     await account.$query(trx).patch({ balance: account.balance });
    //     const debitTransaction = await MutationModel.query(trx).insert({
    //       id: uuidv4(),
    //       amount: transactionRequest.amount,
    //       mutation_type: EnumMutationType.TRANSFER,
    //       description: transactionRequest.description,
    //       account_number: account.account_number,
    //       user_id: request.user.id,
    //       full_name: account.full_name,
    //       transaction_purpose: EnumTransactionPurpose.OTHER,
    //       transaction_type: EnumTransactionType.CREDIT,
    //       created_at: new Date(Date.now())
    //     });
    //     await MutationModel.query(trx).insert({
    //       id: uuidv4(),
    //       amount: transactionRequest.amount,
    //       mutation_type: EnumMutationType.TRANSFER,
    //       description: transactionRequest.description,
    //       account_number: request.user.account_number,
    //       user_id: data.account_id,
    //       full_name: request.user.full_name,
    //       transaction_purpose: EnumTransactionPurpose.OTHER,
    //       transaction_type: EnumTransactionType.DEBIT,
    //       created_at: new Date(Date.now())
    //     });
    //     return debitTransaction;
    //   });
    //   return toTransactionResponse(result);
    // }
    static async generateQrCode(req) {
        const transactionRequest = validators_1.Validation.validate(transaction_validation_1.TransactionValidation.QR, req);
        const account = req.user;
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
        const amount = transactionRequest.amount || 0;
        const transactionIdPrefix = '05400804DMCT';
        const uuidTD = (0, uuid_1.v4)().replace(/-/g, '') + '0714';
        const accountNumber = account.account_number;
        const accountNumberTag = '00' + accountNumber.length;
        const transactionId = transactionIdPrefix + uuidTD + accountNumber + accountNumberTag;
        console.log('transactionId:', transactionId);
        let qrDataPayload = '';
        if (!amount) {
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
        }
        else if (amount > 0) {
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
        const checksum = await (0, generateChecksum_1.generateChecksum)(qrDataPayload);
        console.log('checksum:', checksum);
        const checksumFormat = '63' + checksum.length.toString().padStart(2, '0') + checksum;
        const qrisFinalPayload = qrDataPayload + checksumFormat;
        console.log('qrisFinalPayload:', qrisFinalPayload);
        const extra7hours = 7 * 60 * 60 * 1000; // because of timezone difference between server and client??
        await QrisModel_1.QrisModel.query().insert({
            id: (0, uuid_1.v4)(),
            transaction_id: transactionId,
            expired_at: new Date(Date.now() + 86400000 + extra7hours),
            payload: qrisFinalPayload,
            type: 0,
            used: false,
            user_id: userId
        });
        const qrCode = await qrcode_1.default.toDataURL(qrisFinalPayload);
        return {
            qrCode,
            expiredAt: new Date(Date.now() + 86400000 + extra7hours)
        };
    }
    static async getAllQrCode(req, userId) {
        const request = validators_1.Validation.validate(transaction_validation_1.TransactionValidation.GET_QR, req);
        const qris = await QrisModel_1.QrisModel.query()
            .where('user_id', userId)
            .andWhere('used', request.used || false)
            .andWhere('expired_at', '>', new Date(Date.now()))
            .orderBy('expired_at', 'desc')
            .page(request.page, request.size);
        return qris;
    }
}
exports.QrService = QrService;
//# sourceMappingURL=QrService.js.map