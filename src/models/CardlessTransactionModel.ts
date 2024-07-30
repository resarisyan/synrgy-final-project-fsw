import { Model, ModelObject } from 'objection';
import { EnumCardlessTransaction } from '../enums/cash-transaction-enum';

export class CardlessTransactionModel extends Model {
  static tableName = 'cardless_transaction';
  id!: string;
  user_id!: string;
  token_name!: string;
  amount!: number;
  expired_at!: Date;
  token!: string;
  status!: boolean;
  is_expired!: boolean;
  type!: EnumCardlessTransaction;
  created_at!: Date;
  updated_at!: Date;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserModel',
      join: {
        from: 'cardless_transaction.user_id',
        to: 'users.id'
      }
    }
  };
}

export type User = ModelObject<CardlessTransactionModel>;
