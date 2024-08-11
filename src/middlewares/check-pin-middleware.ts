import { Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel'; // Sesuaikan dengan model user yang Anda gunakan
import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { errorResponse } from '../dtos/response/error-response';

export const checkPinMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const pin = req.body.pin;

    console.log('User ID:', userId);

    if (!userId) {
      return next(new ResponseError(400, 'User ID required'));
    }

    if (!pin) {
      return next(new ResponseError(400, 'PIN required'));
    }

    const user = await UserModel.query().findById(userId);
    if (!user) {
      return next(new ResponseError(401, 'User not found'));
    }

    if (pin !== user.pin) {
      return next(new ResponseError(401, 'Invalid PIN'));
    }
  } catch (err) {
    return errorResponse({ error: err as Error, res });
  }

  next();
};
