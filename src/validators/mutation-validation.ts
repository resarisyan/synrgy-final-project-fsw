import { z, ZodType } from 'zod';

export class MutationValidation {
  static GetMutation: ZodType = z.object({
    page: z.union([z.string(), z.number()]).transform((value) => {
      const num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num) || num <= 0) {
        throw new Error('Page must be a positive integer.');
      }
      return num;
    }),
    size: z.union([z.string(), z.number()]).transform((value) => {
      const num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num) || num <= 0) {
        throw new Error('Size must be a positive integer.');
      }
      return num;
    }),
    category: z.string().optional(),
    mutationType: z.string().optional(),
    dateRange: z
      .object({
        start: z.string().refine((value) => !isNaN(Date.parse(value)), {
          message: 'Start date must be a valid date.'
        }),
        end: z.string().refine((value) => !isNaN(Date.parse(value)), {
          message: 'End date must be a valid date.'
        })
      })
      .optional()
      .refine(
        (data) => {
          if (data) {
            const now = new Date();
            const currentYear = now.getFullYear();

            const startDate = new Date(data.start);
            const endDate = new Date(data.end);

            // Check if start or end year is greater than the current year
            if (
              startDate.getFullYear() > currentYear ||
              endDate.getFullYear() > currentYear
            ) {
              return false;
            }

            // Check if start date is after end date
            if (startDate > endDate) {
              return false;
            }
          }
          return true;
        },
        {
          message:
            'Date range is invalid. Ensure that the dates are valid and that the start date is before or equal to the end date. Also, dates should not be in the future.'
        }
      )
  });
}
