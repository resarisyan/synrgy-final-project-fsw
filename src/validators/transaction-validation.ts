import { z, ZodType } from 'zod';

export class TransactionValidation {
  static QR: ZodType = z.object({
    amount: z.number().positive().int(),
    description: z.string().optional()
  });
}
