import { z, ZodType } from 'zod';

export class GeneralValidation {
  static PHONE: ZodType = z.object({
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits long' })
      .max(15, { message: 'Phone number must be at most 15 digits long' })
      .regex(/^\d+$/, { message: 'Phone number must only contain digits' })
  });

  static PIN: ZodType = z.object({
    pin: z
      .string()
      .length(6, { message: 'PIN must be exactly 6 digits long' })
      .regex(/^\d+$/, { message: 'PIN must only contain digits' })
  });
}
