import express from 'express';
import { QrController } from '../controllers/QrController';
import { authMiddleware } from '../middlewares/auth-middleware';
import { checkPinMiddleware } from '../middlewares/check-pin-middleware';
import { CardlessController } from '../controllers/CardlessController';
import { checkPhoneMiddleware } from '../middlewares/check-phone-middleware';
export const transactionRouter = express.Router();

transactionRouter.post(
  '/generate-qr',
  authMiddleware,
  QrController.generateQrCode
);
// transactionRouter.post(
//   '/transfer-qr',
//   checkPinMiddleware,
//   QrController.transferQr
// );

transactionRouter.post(
  '/generate-token',
  authMiddleware,
  checkPinMiddleware,
  CardlessController.tokenGenerate
);

transactionRouter.post(
  '/demo-withdraw',
  checkPhoneMiddleware,
  CardlessController.demoWithdraw
);
transactionRouter.post(
  '/demo-topup',
  checkPhoneMiddleware,
  CardlessController.demoTopup
);

transactionRouter.get(
  '/token-history',
  authMiddleware,
  CardlessController.tokenHistory
);
