import { z, ZodType } from 'zod';

export class MutationValidation {
  static GetMutation: ZodType = z.object({
    page: z.number().positive().int(),
    size: z.number().positive().int(),
    category: z.string().optional(),
    dateRange: z
      .object({
        start: z.string(),
        end: z.string()
      })
      .optional()
  });
}
