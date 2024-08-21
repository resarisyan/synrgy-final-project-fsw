import express from 'express';
import { transactionRouter } from './transaction-router';
import { mutationRouter } from './mutation-router';
export const apiRouter = express.Router();

apiRouter.use('/transactions', transactionRouter);
apiRouter.use('/mutations', mutationRouter);
