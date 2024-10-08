import { Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel'; // Sesuaikan dengan model user yang Anda gunakan
import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { errorResponse } from '../dtos/response/error-response';
import { checkPin } from '../helpers/checkPin';
import { Validation } from '../validators';
import { GeneralValidation } from '../validators/general-validation';

export const checkPinMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const request = Validation.validate(GeneralValidation.PIN, req.body);
    const pin = request.pin;

    if (!userId) {
      throw new ResponseError(400, 'User ID and PIN are required');
    }

    const user = await UserModel.query().findById(userId);
    if (!user) {
      throw new ResponseError(401, 'User not found');
    }

    const userPin = user.pin;

    const pinValidation = await checkPin(userPin, pin);
    if (!pinValidation) {
      throw new ResponseError(401, 'Invalid PIN');
    }
  } catch (err) {
    return errorResponse({ error: err as Error, res });
  }

  return next();
};
