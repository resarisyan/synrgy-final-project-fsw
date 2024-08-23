import { z, ZodType } from 'zod';

export class TransactionValidation {
  static QR: ZodType = z.object({
    amount: z
      .number({
        required_error: 'Amount (Nominal) harus diisi',
        invalid_type_error: 'Amount (Nominal) harus berupa angka'
      })
      .nonnegative('Amount (Nominal) harus lebih besar dari 0'),
    description: z.string().optional()
  });
}
