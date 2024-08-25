"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashTransactionValidation = void 0;
const zod_1 = require("zod");
class CashTransactionValidation {
}
exports.CashTransactionValidation = CashTransactionValidation;
CashTransactionValidation.CREATE = zod_1.z.object({
    amount: zod_1.z.number().positive().int(),
    type: zod_1.z.enum(['TOPUP', 'WITHDRAW'])
});
CashTransactionValidation.STORE = zod_1.z.object({
    token: zod_1.z.string(),
    type: zod_1.z.enum(['TOPUP', 'WITHDRAW'])
});
//# sourceMappingURL=cash-transaction-validation.js.map