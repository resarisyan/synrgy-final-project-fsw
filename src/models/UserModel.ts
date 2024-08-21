import { Model, ModelObject } from 'objection';
import { MutationModel } from './MutattionModel';
import { CashTransactionModel } from './CashTransactionModel';
export class UserModel extends Model {
  static tableName = 'users';
  id!: string;
  full_name!: string;
  username!: string;
  email!: string;
  phone!: string;
  password!: string;
  verified!: boolean;
  pin!: string;
  account_number!: string;
  balance!: number;
  enabled!: boolean;
  default_password!: boolean;
  created_at!: Date;
  updated_at!: Date;

  static relationMappings = {
    mutations: {
      relation: Model.HasManyRelation,
      modelClass: MutationModel,
      join: {
        from: 'users.id',
        to: 'mutations.user_id'
      }
    },
    cash_transactions: {
      relation: Model.HasManyRelation,
      modelClass: CashTransactionModel,
      join: {
        from: 'users.id',
        to: 'cash_transactions.user_id'
      }
    }
  };
}

export type User = ModelObject<UserModel>;
