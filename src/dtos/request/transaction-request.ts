import { EnumMutationType } from '../../enums/mutation-type-enum';
import { EnumCardlessType } from '../../enums/cardless-type-enum';

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

export type DemoWithdrawRequest = {
  token: string;
  pin: string;
  user_id: string;
  access_at: Date;
};

export type DemoDepositRequest = {
  amount: number;
  token: string;
  pin: string;
  user_id: string;
  access_at: Date;
};

export type TransactionCardlessRequest = {
  user_id: string;
  amount: number;
  pin: string;
  status: boolean;
  type: EnumCardlessType;
};
