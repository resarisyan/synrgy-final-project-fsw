import { z, ZodType } from 'zod';

export class TransactionValidation {
  static QR: ZodType = z.object({
    amount: z.number().positive().int(),
    description: z.string().optional()
  });
}

export class DemoWithdraw {
  static WD: ZodType = z.object({
    token: z.string(),
    pin: z.string(),
    user_id: z.string(),
    access_at: z.date()
  });
}

export class DemoDeposit {
  static DEPO: ZodType = z.object({
    token: z.string(),
    pin: z.string(),
    amount: z.number(),
    user_id: z.string(),
    access_at: z.date()
  });
}
