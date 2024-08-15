import { EnumCashTransaction } from '../../enums/cash-transaction-enum';
import { CashTransactionModel } from '../../models/CashTransactionModel';

export type CashTransactionResponse = {
  amount: number;
  type: EnumCashTransaction;
  is_success: boolean;
  code: string;
  expired_at: Date;
};

export type CashTransactionHistoryResponse = {
  amount: number;
  type: EnumCashTransaction;
  is_success: boolean;
  code: string;
  created_at: Date;
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

export function toCashTransactionHistoryResponse(
  cashTransaction: CashTransactionModel
): CashTransactionHistoryResponse {
  return {
    amount: cashTransaction.amount,
    type: cashTransaction.type,
    is_success: cashTransaction.is_success,
    code: cashTransaction.code,
    created_at: cashTransaction.created_at
  };
}
