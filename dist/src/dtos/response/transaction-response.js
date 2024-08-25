"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTransactionResponse = toTransactionResponse;
function toTransactionResponse(transaction) {
    return {
        amount: transaction.amount,
        description: transaction.description,
        is_favorites: transaction.is_favorites,
        mutation_type: transaction.mutation_type,
        account_number: transaction.account_number,
        full_name: transaction.full_name,
        transaction_purpose: transaction.transaction_purpose,
        transaction_type: transaction.transaction_type
    };
}
//# sourceMappingURL=transaction-response.js.map