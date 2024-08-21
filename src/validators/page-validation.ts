import { z, ZodType } from 'zod';

export class PageValidation {
  static readonly PAGE: ZodType = z.object({
    page: z.number().int().min(0),
    size: z.number().int().min(0)
  });
}
