import { Response } from 'express';
import { UserRequest } from '../dtos/request/user-request';
import { QrService } from '../services/QrService';
import { TransactionQrRequest } from '../dtos/request/transaction-request';
import { errorResponse } from '../dtos/response/error-response';

export class QrController {
  static async generateQrCode(req: UserRequest, res: Response) {
    try {
      const request = req.body as TransactionQrRequest;
      request.user = req.user!;
      const qrCode = await QrService.generateQrCode(request);
      res.json({
        success: true,
        message: 'QR code generated successfully',
        data: qrCode
      });
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }

  static async transferQr(req: UserRequest, res: Response) {
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
      errorResponse({ error: error as Error, res });
    }
  }
}
