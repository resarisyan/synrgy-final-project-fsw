import { EnumMutationType } from '../../enums/mutation-type-enum';

export type TransactionRequest = {
  amount: number;
  type: EnumMutationType;
  description?: string;
  account_number?: string;
  keperluan?: string;
};

export type TransactionQrRequest = {
  amount: number;
  description?: string;
  account_id: string;
  key: string;
};
