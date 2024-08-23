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
}
