import { EnumMutationType } from '../../enums/mutation-type-enum';
import { User } from '../../models/UserModel';

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
  user: User;
  key: string;
};
