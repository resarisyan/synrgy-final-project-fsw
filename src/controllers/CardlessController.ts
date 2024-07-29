import { Response, NextFunction } from 'express';
import { UserRequest } from '../dtos/request/user-request';
import {
  DemoDepositRequest,
  DemoWithdrawRequest,
  TransactionCardlessRequest
} from '../dtos/request/transaction-request';
import { CardlessService } from '../services/CardlessService';

export class CardlessController {
  static tokenGenerate = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body as TransactionCardlessRequest;
      request.user_id = req.user!.id;
      request.pin = req.user!.pin;
      request.type = req.body.type;

      const transaction = await CardlessService.tokenGenerate(request);
      res.json({
        success: true,
        message: 'Token Generated Successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };

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
