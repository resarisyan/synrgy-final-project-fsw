import {
  EstatementRequest,
  GetMutationRequest
} from '../dtos/request/mutation-request';
import { UserRequest } from '../dtos/request/user-request';
import { errorResponse } from '../dtos/response/error-response';
import { MutationService } from '../services/MutationService';
import { Response } from 'express';
import fs from 'fs';

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

  static async generatePdf(req: UserRequest, res: Response) {
    try {
      const id = req.params.id;
      const mutation = await MutationService.getOne(id, req.user!);

      const pdfFilePath = `mutation.pdf`;

      await MutationService.generatePdf(mutation, pdfFilePath);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${pdfFilePath}"`
      );
      res.setHeader('Content-Type', 'application/pdf');

      res.download(pdfFilePath, (err) => {
        if (err) {
          console.error('Error sending the file:', err);
          errorResponse({ error: err, res });
        } else {
          fs.unlink(pdfFilePath, (unlinkErr) => {
            if (unlinkErr) {
              errorResponse({ error: unlinkErr, res });
            }
          });
        }
      });
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }

  static async generateEstatement(req: UserRequest, res: Response) {
    try {
      const request: EstatementRequest =
        req.query as unknown as EstatementRequest;
      const pdfFilePath = `e-statement-${req.user?.full_name}-${new Date().toISOString()}.pdf`;
      await MutationService.generateEStatement(request, req.user!, pdfFilePath);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${pdfFilePath}"`
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.download(pdfFilePath, (err) => {
        if (err) {
          errorResponse({ error: err, res });
        } else {
          fs.unlink(pdfFilePath, (unlinkErr) => {
            if (unlinkErr) {
              errorResponse({ error: unlinkErr, res });
            }
          });
        }
      });
    } catch (error) {
      errorResponse({ error: error as Error, res });
    }
  }
}
