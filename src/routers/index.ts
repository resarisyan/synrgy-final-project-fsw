import express from 'express';
import { transactionRouter } from './transaction-router';
export const apiRouter = express.Router();

apiRouter.use('/transactions', transactionRouter);
