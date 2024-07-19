import { Model } from 'objection';
import { UserModel } from './UserModel';

export class AccountModel extends Model {
  static tableName = 'accounts';
  id!: string;
  balance!: number;
  user_id!: string;
  created_at!: Date;
  updated_at!: Date;
  user!: UserModel;
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserModel',
      join: {
        from: 'accounts.user_id',
        to: 'users.id'
      }
    }
  };
}
