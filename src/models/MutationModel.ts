import { Model, ModelObject } from 'objection';
import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { EnumTransactionPurpose } from '../enums/transaction-purpose-enum';
import { UserModel } from './UserModel';

export class MutationModel extends Model {
  static tableName = 'mutations';

  // Define your fields here
  id!: string;
  user_id!: string;
  amount!: number;
  description?: string;
  is_favorites!: boolean;
  mutation_type!: EnumMutationType;
  account_number!: string;
  full_name!: string;
  transaction_purpose!: EnumTransactionPurpose;
  transaction_type!: EnumTransactionType;
  created_at!: Date;
  updated_at!: Date;
  user!: UserModel;
  account!: UserModel;

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'mutations.user_id',
        to: 'users.id'
      }
    },
    account: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'mutations.account_number',
        to: 'users.account_number'
      }
    }
  });
}

export type Mutation = ModelObject<MutationModel>;
