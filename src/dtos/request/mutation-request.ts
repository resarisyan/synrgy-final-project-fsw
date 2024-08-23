export type GetMutationRequest = {
  page: number;
  size: number;
  category?: string;
  mutationType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
};
