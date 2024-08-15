import express from 'express';
import { QrController } from '../controllers/QrController';
import { authMiddleware } from '../middlewares/auth-middleware';
import { checkPinMiddleware } from '../middlewares/check-pin-middleware';
import { CardlessController } from '../controllers/CardlessController';
export const transactionRouter = express.Router();

transactionRouter.use(authMiddleware);
transactionRouter.get('/generate-qr', QrController.generateQrCode);
transactionRouter.post(
  '/transfer-qr',
  checkPinMiddleware,
  QrController.transferQr
);

transactionRouter.post(
  '/generate-token',
  checkPinMiddleware,
  CardlessController.tokenGenerate
);

transactionRouter.post(
  '/demo-withdraw',
  checkPinMiddleware,
  CardlessController.demoWithdraw
);
transactionRouter.post(
  '/demo-topup',
  checkPinMiddleware,
  CardlessController.demoTopup
);

transactionRouter.get(
  '/token-history',
  checkPinMiddleware,
  CardlessController.tokenHistory
);
