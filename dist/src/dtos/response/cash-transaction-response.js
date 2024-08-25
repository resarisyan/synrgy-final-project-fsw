"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCashTransactionResponse = toCashTransactionResponse;
exports.toCashTransactionHistoryResponse = toCashTransactionHistoryResponse;
function toCashTransactionResponse(cashTransaction) {
    return {
        amount: cashTransaction.amount,
        type: cashTransaction.type,
        is_success: cashTransaction.is_success,
        code: cashTransaction.code,
        expired_at: cashTransaction.expired_at
    };
}
function toCashTransactionHistoryResponse(cashTransaction) {
    return {
        amount: cashTransaction.amount,
        type: cashTransaction.type,
        is_success: cashTransaction.is_success,
        code: cashTransaction.code,
        created_at: cashTransaction.created_at
    };
}
//# sourceMappingURL=cash-transaction-response.js.map