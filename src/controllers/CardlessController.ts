import { Response, NextFunction } from 'express';
import { UserRequest } from '../dtos/request/user-request';
import {
  CashTransactionCreateRequest,
  CashTransactionStoreRequest
} from '../dtos/request/cash-transaction-request';
import { CashTransactionService } from '../services/CashTransactionService';
import { EnumCashTransaction } from '../enums/cash-transaction-enum';

export class CardlessController {
  static tokenGenerate = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body as CashTransactionCreateRequest;
      request.user = req.user!;
      const transaction = await CashTransactionService.create(request);
      res.json({
        success: true,
        message: 'Token Generated Successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };

  static demoWithdraw = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body as CashTransactionStoreRequest;
      request.type = EnumCashTransaction.WITHDRAW;
      request.user = req.user!;
      const transaction = await CashTransactionService.store(request);
      res.json({
        success: true,
        message: 'Withdraw Successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };

  static demoTopup = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body as CashTransactionStoreRequest;
      request.type = EnumCashTransaction.TOPUP;
      request.user = req.user!;
      const transaction = await CashTransactionService.store(request);
      res.json({
        success: true,
        message: 'Topup Successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };
}
