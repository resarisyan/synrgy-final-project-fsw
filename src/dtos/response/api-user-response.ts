import { User } from '../../models/UserModel';

export type ApiUserResponse = {
  success: boolean;
  message: string;
  data: User;
};
