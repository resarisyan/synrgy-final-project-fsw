"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const QrController_1 = require("../controllers/QrController");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const check_pin_middleware_1 = require("../middlewares/check-pin-middleware");
const CardlessController_1 = require("../controllers/CardlessController");
const check_phone_middleware_1 = require("../middlewares/check-phone-middleware");
exports.transactionRouter = express_1.default.Router();
exports.transactionRouter.get('/qr', auth_middleware_1.authMiddleware, QrController_1.QrController.getAllQr);
exports.transactionRouter.post('/generate-qr', auth_middleware_1.authMiddleware, QrController_1.QrController.generateQrCode);
// transactionRouter.post(
//   '/transfer-qr',
//   checkPinMiddleware,
//   QrController.transferQr
// );
exports.transactionRouter.post('/generate-token', auth_middleware_1.authMiddleware, check_pin_middleware_1.checkPinMiddleware, CardlessController_1.CardlessController.tokenGenerate);
exports.transactionRouter.post('/demo-withdraw', check_phone_middleware_1.checkPhoneMiddleware, CardlessController_1.CardlessController.demoWithdraw);
exports.transactionRouter.post('/demo-topup', check_phone_middleware_1.checkPhoneMiddleware, CardlessController_1.CardlessController.demoTopup);
exports.transactionRouter.get('/token-history', auth_middleware_1.authMiddleware, CardlessController_1.CardlessController.tokenHistory);
//# sourceMappingURL=transaction-router.js.map