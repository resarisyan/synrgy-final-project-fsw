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
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new ResponseError(401, 'Token not found');
    }

    const jwtToken = authHeader.split(' ')[1];
    const res = (await fetch(`${process.env.BE_JAVA_URL}/account/detail`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    }).then((res) => res.json())) as ApiUserResponse;

    if (!res.success) {
      return next(new ResponseError(401, res.message));
    }
    const user = await UserModel.query().findById(res.data.user_id);
    req.user = user;
  } catch (err) {
    return errorResponse({ error: err as Error, res });
  }

  next();
};
