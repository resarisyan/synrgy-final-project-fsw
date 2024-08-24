import { QrisModel } from '../../models/QrisModel';
import { UserModel } from '../../models/UserModel';
export type QrResponse = {
  transaction_id: string;
  expired_at: Date;
  payload: string;
  updated_at: Date;
  type: number;
  used: boolean;
  user: UserModel;
};

export function toQrResponse(qr: QrisModel): QrResponse {
  return {
    transaction_id: qr.transaction_id,
    expired_at: qr.expired_at,
    payload: qr.payload,
    updated_at: qr.updated_at,
    type: qr.type,
    used: qr.used,
    user: qr.user
  };
}
