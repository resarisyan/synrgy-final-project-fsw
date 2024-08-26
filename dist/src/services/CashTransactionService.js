"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashTransactionService = void 0;
const mutation_type_enum_1 = require("../enums/mutation-type-enum");
const transaction_type_enum_1 = require("../enums/transaction-type-enum");
const response_error_1 = require("../handlers/response-error");
const UserModel_1 = require("../models/UserModel");
const validators_1 = require("../validators");
const randomTokenGenerate_1 = require("../helpers/randomTokenGenerate");
const cash_transaction_enum_1 = require("../enums/cash-transaction-enum");
const CashTransactionModel_1 = require("../models/CashTransactionModel");
const cash_transaction_validation_1 = require("../validators/cash-transaction-validation");
const transaction_purpose_enum_1 = require("../enums/transaction-purpose-enum");
const cash_transaction_response_1 = require("../dtos/response/cash-transaction-response");
const uuid_1 = require("uuid");
const MutationModel_1 = require("../models/MutationModel");
class CashTransactionService {
    static async create(request) {
        const token = (0, randomTokenGenerate_1.randomTokenGenerate)();
        const currentTime = new Date(Date.now());
        const oneHourLater = new Date(currentTime.getTime() + 3600000);
        const createRequest = validators_1.Validation.validate(cash_transaction_validation_1.CashTransactionValidation.CREATE, request);
        if (createRequest.type === cash_transaction_enum_1.EnumCashTransaction.TOPUP) {
            createRequest.amount = 0;
        }
        if (createRequest.type === cash_transaction_enum_1.EnumCashTransaction.WITHDRAW) {
            if (createRequest.amount < 50000 || createRequest.amount % 50000 !== 0) {
                throw new response_error_1.ResponseError(400, 'Withdraw amount must be a multiple of 50000');
            }
            else if (createRequest.amount > 5000000) {
                throw new response_error_1.ResponseError(400, 'Withdraw amount must be less than Rp5.000.000');
            }
            else if (createRequest.amount > request.user.balance) {
                throw new response_error_1.ResponseError(400, 'Saldo tidak mencukupi');
            }
        }
        const data = await CashTransactionModel_1.CashTransactionModel.query().insert({
            user_id: request.user.id,
            amount: createRequest.amount,
            expired_at: oneHourLater,
            type: createRequest.type,
            code: token,
            is_success: false,
            created_at: currentTime,
            updated_at: currentTime
        });
        return (0, cash_transaction_response_1.toCashTransactionResponse)(data);
    }
    static async store(req, userID) {
        const storeRequest = validators_1.Validation.validate(cash_transaction_validation_1.CashTransactionValidation.STORE, req);
        const user = await UserModel_1.UserModel.query()
            .findById(userID)
            .forUpdate()
            .throwIfNotFound();
        const cashTransaction = await CashTransactionModel_1.CashTransactionModel.query()
            .where({
            user_id: userID,
            code: storeRequest.token
        })
            .first()
            .throwIfNotFound();
        if (cashTransaction.type !== storeRequest.type) {
            throw new response_error_1.ResponseError(400, 'Token type is not match');
        }
        else if (cashTransaction.is_success) {
            throw new response_error_1.ResponseError(400, 'Token has already been taken');
        }
        else if (cashTransaction.expired_at <= new Date(Date.now())) {
            throw new response_error_1.ResponseError(400, 'Token has already expired');
        }
        const isWithdraw = storeRequest.type === cash_transaction_enum_1.EnumCashTransaction.WITHDRAW;
        const isTopup = storeRequest.type === cash_transaction_enum_1.EnumCashTransaction.TOPUP;
        if (isWithdraw && Number(user.balance) < Number(cashTransaction.amount)) {
            throw new response_error_1.ResponseError(400, 'Balance is not enough to withdraw');
        }
        const result = await UserModel_1.UserModel.transaction(async (trx) => {
            let transactionAmount = cashTransaction.amount;
            if (isTopup) {
                if (storeRequest.amount < 50000 || storeRequest.amount % 50000 !== 0) {
                    throw new response_error_1.ResponseError(400, 'Topup amount must be a multiple of 50000');
                }
                else if (storeRequest.amount > 5000000) {
                    throw new response_error_1.ResponseError(400, 'Topup amount must be less than Rp5.000.000');
                }
                else {
                    await cashTransaction.$query(trx).patch({
                        amount: storeRequest.amount
                    });
                    transactionAmount = storeRequest.amount;
                }
            }
            const newBalance = isWithdraw
                ? Number(user.balance) - Number(transactionAmount)
                : Number(user.balance) + Number(transactionAmount);
            await user.$query(trx).patch({ balance: newBalance });
            await MutationModel_1.MutationModel.query(trx).insert({
                id: (0, uuid_1.v4)(),
                amount: transactionAmount,
                mutation_type: mutation_type_enum_1.EnumMutationType.TRANSFER,
                description: isWithdraw ? 'Withdraw' : 'Topup',
                account_number: user.account_number,
                user_id: user.id,
                full_name: user.full_name,
                transaction_purpose: transaction_purpose_enum_1.EnumTransactionPurpose.OTHER,
                transaction_type: isWithdraw
                    ? transaction_type_enum_1.EnumTransactionType.DEBIT
                    : transaction_type_enum_1.EnumTransactionType.CREDIT,
                created_at: new Date(Date.now())
            });
            await cashTransaction.$query(trx).patch({
                is_success: true,
                updated_at: new Date(Date.now())
            });
            return cashTransaction;
        });
        return (0, cash_transaction_response_1.toCashTransactionResponse)(result);
    }
    static async getAllTransactions(request) {
        const data = CashTransactionModel_1.CashTransactionModel.query()
            .where('user_id', request.user.id)
            .where('is_success', true)
            .orderBy('created_at', 'desc');
        if (request.createdAtStart && request.createdAtEnd) {
            data.whereBetween('created_at', [
                request.createdAtStart.toISOString(),
                request.createdAtEnd.toISOString()
            ]);
        }
        if ((await data).length === 0) {
            throw new response_error_1.ResponseError(404, 'Data not found');
        }
        return (await data).map(cash_transaction_response_1.toCashTransactionHistoryResponse);
    }
}
exports.CashTransactionService = CashTransactionService;
//# sourceMappingURL=CashTransactionService.js.map