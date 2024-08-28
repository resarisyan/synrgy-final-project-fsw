import { EnumMutationType } from './../../enums/mutation-type-enum';
import { EnumFile } from '../../enums/enum-file';
import { EnumTransactionType } from '../../enums/transaction-type-enum';

export type GetMutationRequest = {
  page: number;
  size: number;
  category?: string;
  mutationType?: EnumMutationType;
  transactionType?: EnumTransactionType;
  dateRange?: {
    start: string;
    end: string;
  };
};

export type EstatementRequest = {
  dateRange: {
    start: string;
    end: string;
  };
};

export type DocumentRequest = {
  id: string;
  outputType: EnumFile;
};
