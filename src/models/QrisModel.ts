import { Model, ModelObject } from 'objection';
import { UserModel } from './UserModel';

export class QrisModel extends Model {
  static tableName = 'qris';
  id!: string;
  transaction_id!: string;
  expired_at!: Date;
  payload!: string;
  updated_at!: Date;
  type!: number;
  used!: boolean;
  user_id!: string;
  user!: UserModel;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'qris.user_id',
        to: 'users.id'
      }
    }
  };
}

export type Qris = ModelObject<QrisModel>;
