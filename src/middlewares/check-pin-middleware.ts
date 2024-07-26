import { Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel'; // Sesuaikan dengan model user yang Anda gunakan
import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';

export const checkPinMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const pin = req.body.pin;

    if (!userId || !pin) {
      return next(new ResponseError(400, 'User ID and PIN are required'));
    }

    const user = await UserModel.query().findById(userId);
    if (!user) {
      return next(new ResponseError(401, 'User not found'));
    }

    if (pin !== user.pin) {
      return next(new ResponseError(401, 'Invalid PIN'));
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
