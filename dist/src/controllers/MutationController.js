"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationController = void 0;
const error_response_1 = require("../dtos/response/error-response");
const MutationService_1 = require("../services/MutationService");
const fs_1 = __importDefault(require("fs"));
class MutationController {
    static async getAll(req, res) {
        try {
            const request = req.query;
            const mutations = await MutationService_1.MutationService.getAll(request, req.user);
            res.json({
                success: true,
                message: 'Data found',
                data: mutations
            });
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
    static async getOne(req, res) {
        try {
            const id = req.params.id;
            const mutation = await MutationService_1.MutationService.getOne(id, req.user);
            res.json({
                success: true,
                message: 'Data found',
                data: mutation
            });
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
    static async generatePdf(req, res) {
        try {
            const id = req.params.id;
            const mutation = await MutationService_1.MutationService.getOne(id, req.user);
            const pdfFilePath = `mutation.pdf`;
            await MutationService_1.MutationService.generatePdf(mutation, pdfFilePath);
            res.setHeader('Content-Disposition', `attachment; filename="${pdfFilePath}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.download(pdfFilePath, (err) => {
                if (err) {
                    console.error('Error sending the file:', err);
                    (0, error_response_1.errorResponse)({ error: err, res });
                }
                else {
                    fs_1.default.unlink(pdfFilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            (0, error_response_1.errorResponse)({ error: unlinkErr, res });
                        }
                    });
                }
            });
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
    static async generateEstatement(req, res) {
        try {
            const request = req.query;
            const pdfFilePath = `e-statement-${req.user?.full_name}-${new Date().toISOString()}.pdf`;
            await MutationService_1.MutationService.generateEStatement(request, req.user, pdfFilePath);
            res.setHeader('Content-Disposition', `attachment; filename="${pdfFilePath}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.download(pdfFilePath, (err) => {
                if (err) {
                    (0, error_response_1.errorResponse)({ error: err, res });
                }
                else {
                    fs_1.default.unlink(pdfFilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            (0, error_response_1.errorResponse)({ error: unlinkErr, res });
                        }
                    });
                }
            });
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
}
exports.MutationController = MutationController;
//# sourceMappingURL=MutationController.js.map