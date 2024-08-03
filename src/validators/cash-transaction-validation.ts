import { z, ZodType } from 'zod';

export class CashTransactionValidation {
  static CREATE: ZodType = z.object({
    amount: z.number().positive().int(),
    type: z.enum(['TOPUP', 'WITHDRAW'])
  });

  static STORE: ZodType = z.object({
    token: z.string(),
    type: z.enum(['TOPUP', 'WITHDRAW'])
  });
}
