import { EnumMutationType } from '../../enums/mutation-type-enum';
import { EnumTransactionPurpose } from '../../enums/transaction-purpose-enum';
import { EnumTransactionType } from '../../enums/transaction-type-enum';
import { MutationModel } from '../../models/MutattionModel';

export type TransactionResponse = {
  amount: number;
  description?: string;
  is_favorites: boolean;
  mutation_type: EnumMutationType;
  account_number: string;
  full_name: string;
  transaction_purpose: EnumTransactionPurpose;
  transaction_type: EnumTransactionType;
};

export function toTransactionResponse(
  transaction: MutationModel
): TransactionResponse {
  return {
    amount: transaction.amount,
    description: transaction.description,
    is_favorites: transaction.is_favorites,
    mutation_type: transaction.mutation_type,
    account_number: transaction.account_number,
    full_name: transaction.full_name,
    transaction_purpose: transaction.transaction_purpose,
    transaction_type: transaction.transaction_type
  };
}
