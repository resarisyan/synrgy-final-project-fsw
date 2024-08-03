import { Response, NextFunction } from 'express';
import { UserRequest } from '../dtos/request/user-request';
import { QrService } from '../services/QrService';
import { TransactionQrRequest } from '../dtos/request/transaction-request';

export class QrController {
  static async generateQrCode(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const qrCode = await QrService.generateQrCode(req);
      res.json({
        success: true,
        message: 'QR code generated successfully',
        data: qrCode
      });
    } catch (error) {
      next(error);
    }
  }

  static async transferQr(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as TransactionQrRequest;
      request.user = req.user!;
      const transaction = await QrService.transferQr(request);
      res.json({
        success: true,
        message: 'Transaction successful',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
}
