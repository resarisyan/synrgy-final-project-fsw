"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationController = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const error_response_1 = require("../dtos/response/error-response");
const MutationService_1 = require("../services/MutationService");
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
    static async generateDocument(req, res) {
        try {
            const request = req.query;
            const mutation = await MutationService_1.MutationService.getOne(request.id, req.user);
            const filename = `mutation-${mutation.id}-${new Date().toISOString()}.${request.outputType}`;
            const bufferData = await MutationService_1.MutationService.generateDocument(mutation, filename, request.outputType);
            if (request.outputType === 'pdf') {
                res.setHeader('Content-Disposition', `attachment; filename="pdf-${filename}"`);
                res.setHeader('Content-Type', `application/pdf`);
                res.send(Buffer.from(bufferData));
            }
            else {
                const buffer = Buffer.from(bufferData);
                const base64Image = buffer.toString('base64');
                const dataUri = `data:application/${request.outputType};base64,${base64Image}`;
                await cloudinary_1.default.uploader.upload(dataUri, (error, result) => {
                    if (error) {
                        (0, error_response_1.errorResponse)({ error: error, res });
                    }
                    else {
                        res.json({
                            success: true,
                            message: 'Document generated successfully',
                            data: result
                        });
                    }
                });
            }
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
    static async generateEstatement(req, res) {
        try {
            const request = req.query;
            const pdfFilePath = `e-statement-${req.user?.full_name}-${new Date().toISOString()}.pdf`;
            const pdfBuffer = await MutationService_1.MutationService.generateEStatement(request, req.user, pdfFilePath);
            res.setHeader('Content-Disposition', `attachment; filename="${pdfFilePath}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(Buffer.from(pdfBuffer));
        }
        catch (error) {
            (0, error_response_1.errorResponse)({ error: error, res });
        }
    }
}
exports.MutationController = MutationController;
//# sourceMappingURL=MutationController.js.map