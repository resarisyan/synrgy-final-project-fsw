import { Model } from 'objection';
import knexConfig from './config/knex';
import knex from 'knex';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './routers';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import path from 'path';

Model.knex(knex(knexConfig));
dotenv.config();
const port = process.env.PORT || 9999;
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
app.locals.baseURL = `${process.env.BASE_URL}:${port}`;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use('/api/v1', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
  console.log(`Server running on ${app.locals.baseURL}`);
});
