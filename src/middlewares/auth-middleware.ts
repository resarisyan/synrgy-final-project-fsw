import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
// import { ApiUserResponse } from '../dtos/response/api-user-response';
import { UserModel } from '../models/UserModel';
dotenv.config();

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer')) {
    //   return next(
    //     new ResponseError(401, 'Unauthorized - Missing or invalid token')
    //   );
    // }

    // const jwtToken = authHeader.split(' ')[1];
    // const res = (await fetch(`${process.env.BE_JAVA_URL}/account/detail`, {
    //   headers: {
    //     Authorization: `Bearer ${jwtToken}`
    //   }
    // }).then((res) => res.json())) as ApiUserResponse;

    // if (!res.success) {
    //   return next(new ResponseError(401, res.message));
    // }
    // req.user = res.data;

    //test
    const user = await UserModel.query().where('username', 'john_doe').first();
    if (!user) {
      return next(new ResponseError(401, 'Unauthorized - User not found'));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
