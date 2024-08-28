import cloudinary from '../config/cloudinary';
import {
  DocumentRequest,
  EstatementRequest,
  GetMutationRequest
} from '../dtos/request/mutation-request';
import { UserRequest } from '../dtos/request/user-request';
import { errorResponse } from '../dtos/response/error-response';
import { MutationService } from '../services/MutationService';
import { Response } from 'express';

export class MutationController {
  static async getAll(req: UserRequest, res: Response) {
    try {
      const request: GetMutationRequest =
        req.query as unknown as GetMutationRequest;
      const mutations = await MutationService.getAll(request, req.user!);
      res.json({
        success: true,
        message: 'Data found',
        data: mutations
      });
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }

  static async getOne(req: UserRequest, res: Response) {
    try {
      const id = req.params.id;
      const mutation = await MutationService.getOne(id, req.user!);
      res.json({
        success: true,
        message: 'Data found',
        data: mutation
      });
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }

  static async generateDocument(req: UserRequest, res: Response) {
    try {
      const request: DocumentRequest = req.query as unknown as DocumentRequest;
      const mutation = await MutationService.getOne(request.id, req.user!);
      const filename = `mutation-${mutation.id}-${new Date().toISOString()}.${request.outputType}`;
      const bufferData = await MutationService.generateDocument(
        mutation,
        filename,
        request.outputType
      );

      if (request.outputType === 'pdf') {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="pdf-${filename}"`
        );
        res.setHeader('Content-Type', `application/pdf`);
        res.send(Buffer.from(bufferData));
      } else {
        const buffer = Buffer.from(bufferData);
        const base64Image = buffer.toString('base64');
        const dataUri = `data:application/${request.outputType};base64,${base64Image}`;

        await cloudinary.uploader.upload(dataUri, (error, result) => {
          if (error) {
            errorResponse({ error: error as Error, res });
          } else {
            res.json({
              success: true,
              message: 'Document generated successfully',
              data: result
            });
          }
        });
      }
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }

  static async generateEstatement(req: UserRequest, res: Response) {
    try {
      const request: EstatementRequest =
        req.query as unknown as EstatementRequest;
      const pdfFilePath = `e-statement-${req.user?.full_name}-${new Date().toISOString()}.pdf`;
      const pdfBuffer = await MutationService.generateEStatement(
        request,
        req.user!,
        pdfFilePath
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${pdfFilePath}"`
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }
}
