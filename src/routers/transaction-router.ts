import express from 'express';
import { QrController } from '../controllers/QrController';
import { authMiddleware } from '../middlewares/auth-middleware';
import { checkPinMiddleware } from '../middlewares/check-pin-middleware';
export const transactionRouter = express.Router();

transactionRouter.use(authMiddleware);
transactionRouter.get('/generate-qr', QrController.generateQrCode);
transactionRouter.post(
  '/transfer-qr',
  checkPinMiddleware,
  QrController.transferQr
);
