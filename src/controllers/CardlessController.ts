import { Response, NextFunction } from 'express';
import { UserRequest } from '../dtos/request/user-request';
import {
  DemoDepositRequest,
  DemoWithdrawRequest
} from '../dtos/request/transaction-request';
import { CardlessService } from '../services/CardlessService';

export class CardlessController {
  static demoTarikTunai = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body as DemoWithdrawRequest;
      request.user_id = req.user!.id;
      request.access_at = new Date(Date.now());
      // console.log(request);
      // console.log(new Date(Date.now() + 60 * 60 * 1000));

      const transaction = await CardlessService.demoWithdraw(request);
      res.json({
        success: true,
        message: 'Tarik Tunai Successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };

  static demoSetorTunai = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body as DemoDepositRequest;
      request.user_id = req.user!.id;
      request.access_at = new Date(Date.now());
      // console.log(request);
      console.log(new Date(Date.now() + 60 * 60 * 1000));

      const transaction = await CardlessService.demoDeposit(request);
      res.json({
        success: true,
        message: 'Setor Tunai Successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };
}
