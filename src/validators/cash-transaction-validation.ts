import { z, ZodType } from 'zod';
import { ResponseError } from '../handlers/response-error';

export class CashTransactionValidation {
  static CREATE: ZodType = z
    .object({
      amount: z.number().positive().int().optional(),
      type: z.enum(['TOPUP', 'WITHDRAW'])
    })
    .refine((data) => {
      if (data.type === 'WITHDRAW' && data.amount === undefined) {
        throw new ResponseError(
          400,
          'Amount is required for Withdraw transaction'
        );
      }
      return true;
    });

  static STORE: ZodType = z
    .object({
      amount: z.number().positive().int().optional(),
      token: z.string(),
      type: z.enum(['TOPUP', 'WITHDRAW'])
    })
    .refine((data) => {
      if (data.type === 'TOPUP' && data.amount === undefined) {
        throw new ResponseError(
          400,
          'Amount is required for Top Up transaction'
        );
      }
      return true;
    });
}
