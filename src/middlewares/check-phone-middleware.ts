import { Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel';
import { UserRequest } from '../dtos/request/user-request';
import { ResponseError } from '../handlers/response-error';
import { errorResponse } from '../dtos/response/error-response';
import { Validation } from '../validators';
import { GeneralValidation } from '../validators/general-validation';

export const checkPhoneMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = Validation.validate(GeneralValidation.PHONE, req.body);
    const phone = request.phone;

    const user = await UserModel.query().where('phone', phone).first();
    req.user = user;

    const userPhone = user!.phone;

    const phoneValidation = phone === userPhone;
    if (!phoneValidation) {
      throw new ResponseError(401, 'Invalid Phone');
    }
  } catch (err) {
    return errorResponse({ error: err as Error, res });
  }

  return next();
};
