import { z, ZodType } from 'zod';

export class CashTransactionValidation {
  static CREATE: ZodType = z.object({
    user: z
      .object({
        id: z.string().uuid(),
        full_name: z.string(),
        email: z.string().email(),
        account_number: z.string(),
        balance: z.number()
      })
      .required(),
    amount: z.number().positive().int(),
    type: z.enum(['TOPUP', 'WITHDRAW'])
  });

  static STORE: ZodType = z.object({
    token: z.string(),
    type: z.enum(['TOPUP', 'WITHDRAW'])
  });
}
