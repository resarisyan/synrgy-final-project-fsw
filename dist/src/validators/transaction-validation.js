"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
class TransactionValidation {
}
exports.TransactionValidation = TransactionValidation;
TransactionValidation.QR = zod_1.z.object({
    amount: zod_1.z
        .number({
        required_error: 'Amount must be provided',
        invalid_type_error: 'Amount must be a number'
    })
        .positive('Amount must be greater than 0')
        .optional(),
    description: zod_1.z.string().optional()
});
TransactionValidation.GET_QR = zod_1.z.object({
    page: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).transform((value) => {
        const num = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(num) || num <= 0) {
            throw new Error('Page must be a positive integer.');
        }
        return num;
    }),
    size: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).transform((value) => {
        const num = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(num) || num <= 0) {
            throw new Error('Size must be a positive integer.');
        }
        return num;
    }),
    used: zod_1.z
        .string()
        .refine((value) => {
        if (value !== 'true' && value !== 'false') {
            throw new Error('Used must be a boolean string');
        }
        return true;
    })
        .optional()
});
//# sourceMappingURL=transaction-validation.js.map