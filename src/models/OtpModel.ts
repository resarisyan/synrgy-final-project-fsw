import { Model, ModelObject } from 'objection';

export class OtpModel extends Model {
  static tableName = 'otps';
  id!: string;
  otp!: string;
  user_id!: string;
  created_at!: Date;
  updated_at!: Date;
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserModel',
      join: {
        from: 'otp.user_id',
        to: 'users.id'
      }
    }
  };
}

export type User = ModelObject<OtpModel>;
