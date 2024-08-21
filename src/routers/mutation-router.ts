import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { MutationController } from '../controllers/MutationController';

export const mutationRouter = express.Router();

mutationRouter.use(authMiddleware);
mutationRouter.get('/', MutationController.getAll);
mutationRouter.get('/:id', MutationController.getOne);
mutationRouter.get('/:id/pdf', MutationController.generatePdf);
