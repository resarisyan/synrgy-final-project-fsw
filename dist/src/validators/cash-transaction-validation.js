"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashTransactionValidation = void 0;
const zod_1 = require("zod");
const response_error_1 = require("../handlers/response-error");
class CashTransactionValidation {
}
exports.CashTransactionValidation = CashTransactionValidation;
CashTransactionValidation.CREATE = zod_1.z
    .object({
    amount: zod_1.z.number().positive().int().optional(),
    type: zod_1.z.enum(['TOPUP', 'WITHDRAW'])
})
    .refine((data) => {
    if (data.type === 'WITHDRAW' && data.amount === undefined) {
        throw new response_error_1.ResponseError(400, 'Amount is required for Withdraw transaction');
    }
    return true;
});
CashTransactionValidation.STORE = zod_1.z
    .object({
    amount: zod_1.z.number().positive().int().optional(),
    token: zod_1.z.string(),
    type: zod_1.z.enum(['TOPUP', 'WITHDRAW'])
})
    .refine((data) => {
    if (data.type === 'TOPUP' && data.amount === undefined) {
        throw new response_error_1.ResponseError(400, 'Amount is required for Top Up transaction');
    }
    return true;
});
//# sourceMappingURL=cash-transaction-validation.js.map