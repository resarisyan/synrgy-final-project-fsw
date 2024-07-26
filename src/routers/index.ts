import express from 'express';
import { errorMiddleware } from '../middlewares/error-middleware';
import { transactionRouter } from './transaction-router';
export const apiRouter = express.Router();

apiRouter.use('/transactions', transactionRouter);
apiRouter.use(errorMiddleware);
