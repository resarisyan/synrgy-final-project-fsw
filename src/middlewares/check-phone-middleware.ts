import { Response, NextFunction } from 'express';
import { UserModel } from '../models/UserModel';
import { UserRequest } from '../dtos/request/user-request';
import { CashTransactionModel } from '../models/CashTransactionModel';
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
    const reqToken = req.body || {};
    const token = reqToken.token;
    const userId = await CashTransactionModel.query()
      .findOne({ code: token })
      .select('user_id');

    const userID = JSON.parse(JSON.stringify(userId)).user_id;
    const request = Validation.validate(GeneralValidation.PHONE, req.body);
    const phone = request.phone;

    const user = await UserModel.query().findById(userID);
    if (!user) {
      throw new ResponseError(401, 'User not found');
    }

    const userPhone = user.phone;

    const phoneValidation = phone === userPhone;
    if (!phoneValidation) {
      throw new ResponseError(401, 'Invalid Phone');
    }
  } catch (err) {
    return errorResponse({ error: err as Error, res });
  }

  return next();
};
