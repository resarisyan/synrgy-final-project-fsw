"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrController = void 0;
const QrService_1 = require("../services/QrService");
const error_response_1 = require("../dtos/response/error-response");
class QrController {
    static async generateQrCode(req, res) {
        try {
            const request = req.body || {};
            request.user = req.user;
            const qrCode = await QrService_1.QrService.generateQrCode(request);
            res.json({
                success: true,
                message: 'QR code generated successfully',
                data: qrCode
            });
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
    static async getAllQr(req, res) {
        try {
            const request = req.query;
            const userId = req.user.id;
            const qrCodes = await QrService_1.QrService.getAllQrCode(request, userId);
            res.json({
                success: true,
                message: 'Data found',
                data: qrCodes
            });
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
}
exports.QrController = QrController;
//# sourceMappingURL=QrController.js.map