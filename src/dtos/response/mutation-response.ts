import { EnumMutationType } from '../../enums/mutation-type-enum';
import { EnumTransactionPurpose } from '../../enums/transaction-purpose-enum';
import { EnumTransactionType } from '../../enums/transaction-type-enum';

export type MutationResponse = {
  id: string;
  amount: number;
  description?: string;
  mutation_type: EnumMutationType;
  recipientName: string;
  senderName: string;
  senderAccountNumber: string;
  recipientAccountNumber: string;
  transaction_purpose: EnumTransactionPurpose;
  transaction_type: EnumTransactionType;
  created_at: Date;
  updated_at: Date;
};
