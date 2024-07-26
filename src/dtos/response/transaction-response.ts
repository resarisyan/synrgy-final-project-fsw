import { EnumMutationType } from '../../enums/mutation-type-enum';
import { MutationModel } from '../../models/MutattionModel';

export type TransactionResponse = {
  amount: number;
  type: EnumMutationType;
  description?: string;
  user_id: string;
  account_number?: string;
  transaction?: string;
  keperluan?: string;
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
