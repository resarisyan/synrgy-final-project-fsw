import { Model } from 'objection';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { UserModel } from './UserModel';

export class TransactionModel extends Model {
  static tableName = 'transactions';
  id!: string;
  amount!: number;
  type!: EnumTransactionType;
  user_id!: string;
  created_at!: Date;
  updated_at!: Date;
  user!: UserModel;
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserModel',
      join: {
        from: 'transactions.user_id',
        to: 'users.id'
      }
    }
  };
}
