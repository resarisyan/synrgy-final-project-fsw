import { Model, ModelObject } from 'objection';
import { EnumCashTransaction } from '../enums/cash-transaction-enum';

export class CashTransactionModel extends Model {
  static tableName = 'cash_transactions';
  id!: string;
  amount!: number;
  type!: EnumCashTransaction;
  user_id!: string;
  is_success!: boolean;
  code!: string;
  expired_at!: Date;
  created_at!: Date;
  updated_at!: Date;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserModel',
      join: {
        from: 'cash_transactions.user_id',
        to: 'users.id'
      }
    }
  };
}

export type User = ModelObject<CashTransactionModel>;
