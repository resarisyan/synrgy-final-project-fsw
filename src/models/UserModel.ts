import { Model } from 'objection';

export class UserModel extends Model {
  static tableName = 'users';
  id!: string;
  email!: string;
  password!: string;
  enabled!: boolean;
  username!: string;
  name!: string;
  phone!: string;
  created_at!: Date;
  updated_at!: Date;
  static relationMappings = {
    transactions: {
      relation: Model.HasManyRelation,
      modelClass: 'TransactionModel',
      join: {
        from: 'users.id',
        to: 'transactions.user_id'
      }
    }
  };
}
