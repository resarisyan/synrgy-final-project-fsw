import { Model, ModelObject } from 'objection';

export class UserModel extends Model {
  static tableName = 'users';
  id!: string;
  email!: string;
  password!: string;
  isEnabled!: boolean;
  isDefaultPassword!: boolean;
  account_number!: string;
  balance!: number;
  username!: string;
  phone!: string;
  full_name!: string;
  pin!: string;
  created_at!: Date;
  updated_at!: Date;

  static relationMappings = {
    mutations: {
      relation: Model.HasManyRelation,
      modelClass: 'MutationModel',
      join: {
        from: 'users.id',
        to: 'mutations.user_id'
      }
    },
    cash_transactions: {
      relation: Model.HasManyRelation,
      modelClass: 'CashTransactionModel',
      join: {
        from: 'users.id',
        to: 'cash_transactions.user_id'
      }
    },
    otps: {
      relation: Model.HasManyRelation,
      modelClass: 'OtpModel',
      join: {
        from: 'users.id',
        to: 'otps.user_id'
      }
    }
  };
}

export type User = ModelObject<UserModel>;
