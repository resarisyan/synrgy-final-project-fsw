import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { MutationController } from '../controllers/MutationController';

export const mutationRouter = express.Router();

mutationRouter.use(authMiddleware);
mutationRouter.get('/', MutationController.getAll);
mutationRouter.get('/estatement', MutationController.generateEstatement);
mutationRouter.get('/document', MutationController.generateDocument);
mutationRouter.get('/:id', MutationController.getOne);
