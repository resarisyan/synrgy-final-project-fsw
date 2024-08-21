export type GetMutationRequest = {
  page: number;
  size: number;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
};
