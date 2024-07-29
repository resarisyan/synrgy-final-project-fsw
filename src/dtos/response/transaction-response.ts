import { EnumMutationType } from '../../enums/mutation-type-enum';
import { MutationModel } from '../../models/MutattionModel';

import { CardlessTransactionModel } from '../../models/CardlessTransactionModel';

export type TransactionResponse = {
  amount: number;
  type: EnumMutationType;
  description?: string;
  user_id: string;
  account_number?: string;
  transaction?: string;
  keperluan?: string;
};

export type TokenResponse = {
  token: string;
  expired_at: Date;
};

export function toTransactionResponse(
  transaction: MutationModel
): TransactionResponse {
  return {
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    user_id: transaction.user_id,
    account_number: transaction.account_number,
    transaction: transaction.transaction,
    keperluan: transaction.keperluan
  };
}

export function tokenGeneratedResponse(
  transaction: CardlessTransactionModel
): TokenResponse {
  return {
    token: transaction.token,
    expired_at: transaction.expired_at
  };
}
