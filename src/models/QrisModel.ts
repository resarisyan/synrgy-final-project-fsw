import { Model, ModelObject } from 'objection';

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
}

export type Qris = ModelObject<QrisModel>;
