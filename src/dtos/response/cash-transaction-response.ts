import { EnumCashTransaction } from '../../enums/cash-transaction-enum';
import { CashTransactionModel } from '../../models/CashTransactionModel';

export type CashTransactionResponse = {
  amount: number;
  type: EnumCashTransaction;
  is_success: boolean;
  code: string;
  expired_at: Date;
};

export function toCashTransactionResponse(
  cashTransaction: CashTransactionModel
): CashTransactionResponse {
  return {
    amount: cashTransaction.amount,
    type: cashTransaction.type,
    is_success: cashTransaction.is_success,
    code: cashTransaction.code,
    expired_at: cashTransaction.expired_at
  };
}
