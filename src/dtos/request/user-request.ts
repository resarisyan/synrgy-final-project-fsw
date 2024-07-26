import { Request } from 'express';
import { User } from '../../models/UserModel';
export type LoginUserRequest = {
  username: string;
  password: string;
};

export interface UserRequest extends Request {
  user?: User;
}
