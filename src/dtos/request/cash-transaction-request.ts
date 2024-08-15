import { EnumCashTransaction } from '../../enums/cash-transaction-enum';
import { User } from '../../models/UserModel';

export type CashTransactionCreateRequest = {
  user: User;
  amount: number;
  type: EnumCashTransaction;
};

export type CashTransactionStoreRequest = {
  token: string;
  type: EnumCashTransaction;
  user: User;
};

export type CashTransactionHistoryRequest = {
  createdAtStart: Date;
  createdAtEnd: Date;
  user: User;
};
