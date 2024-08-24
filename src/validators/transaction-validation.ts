import { z, ZodType } from 'zod';

export class TransactionValidation {
  static QR: ZodType = z.object({
    amount: z
      .number({
        required_error: 'Amount must be provided',
        invalid_type_error: 'Amount must be a number'
      })
      .nonnegative('Amount must be greater than or equal to 0'),
    description: z.string().optional()
  });

  static GET_QR: ZodType = z.object({
    page: z.union([z.string(), z.number()]).transform((value) => {
      const num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num) || num <= 0) {
        throw new Error('Page must be a positive integer.');
      }
      return num;
    }),
    size: z.union([z.string(), z.number()]).transform((value) => {
      const num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num) || num <= 0) {
        throw new Error('Size must be a positive integer.');
      }
      return num;
    }),
    used: z.boolean().optional()
  });
}
