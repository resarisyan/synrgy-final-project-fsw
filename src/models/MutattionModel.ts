import { Model, ModelObject } from 'objection';
import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';

export class MutationModel extends Model {
  static tableName = 'mutations';
  id!: string;
  amount!: number;
  type!: EnumMutationType;
  description?: string;
  user_id!: string;
  account_number?: string;
  full_name!: string;
  transaction!: EnumTransactionType;
  keperluan?: string;
  created_at!: Date;
  updated_at!: Date;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserModel',
      join: {
        from: 'mutations.user_id',
        to: 'users.id'
      }
    }
  };
}

export type User = ModelObject<MutationModel>;
