import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { ApiUserResponse } from '../dtos/response/api-user-response';
import { UserModel } from '../models/UserModel';
import { errorResponse } from '../dtos/response/error-response';
dotenv.config();

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ResponseError(401, 'Token not found');
    }

    const res = await fetch(`${process.env.BE_JAVA_URL}/account/detail`, {
      headers: {
        Authorization: `Bearer ${authHeader}`
      }
    });

    const data = (await res.json()) as ApiUserResponse;
    console.log(data);

    if (!data || !data.data) {
      throw new ResponseError(401, 'Invalid token or user not found');
    }

    const user = new UserModel();
    user.id = data.data.user_id;
    user.full_name = data.data.full_name;
    user.email = data.data.email;
    user.account_number = data.data.account_number;
    user.balance = parseFloat(
      data.data.balance.replace('Rp', '').replace(',', '')
    );

    req.user = user;

    console.log('User DAta:', req.user);
  } catch (err) {
    return errorResponse({ error: err as Error, res });
  }

  next();
};
