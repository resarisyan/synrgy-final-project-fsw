"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationValidation = void 0;
const zod_1 = require("zod");
class MutationValidation {
}
exports.MutationValidation = MutationValidation;
MutationValidation.GetMutation = zod_1.z.object({
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
    category: zod_1.z.string().optional(),
    mutationType: zod_1.z.string().optional(),
    dateRange: zod_1.z
        .object({
        start: zod_1.z.string().refine((value) => !isNaN(Date.parse(value)), {
            message: 'Start date must be a valid date.'
        }),
        end: zod_1.z.string().refine((value) => !isNaN(Date.parse(value)), {
            message: 'End date must be a valid date.'
        })
    })
        .optional()
        .refine((data) => {
        if (data) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const startDate = new Date(data.start);
            const endDate = new Date(data.end);
            // Check if start or end year is greater than the current year
            if (startDate.getFullYear() > currentYear ||
                endDate.getFullYear() > currentYear) {
                return false;
            }
            // Check if start date is after end date
            if (startDate > endDate) {
                return false;
            }
        }
        return true;
    }, {
        message: 'Date range is invalid. Ensure that the dates are valid and that the start date is before or equal to the end date. Also, dates should not be in the future.'
    })
});
MutationValidation.Estatement = zod_1.z.object({
    dateRange: zod_1.z
        .object({
        start: zod_1.z.string().nonempty({ message: 'Start date is required' }),
        end: zod_1.z.string().nonempty({ message: 'End date is required' })
    })
        .superRefine((data, ctx) => {
        const { start, end } = data;
        // Convert to Date objects
        const startDate = new Date(start);
        const endDate = new Date(end);
        const today = new Date();
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(today.getFullYear() - 3);
        // Validate start date
        if (startDate < threeYearsAgo) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Start date cannot be more than 3 years ago',
                path: ['dateRange', 'start']
            });
        }
        // Validate end date
        if (endDate > today) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'End date cannot be in the future',
                path: ['dateRange', 'end']
            });
        }
        // Validate the range is within 7 months
        const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            endDate.getMonth() -
            startDate.getMonth();
        if (diffMonths > 7) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'End date cannot be more than 7 months from start date',
                path: ['dateRange', 'end']
            });
        }
    })
});
//# sourceMappingURL=mutation-validation.js.map