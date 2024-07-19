import { Model } from 'objection';
import knexConfig from './config/knex';
import knex from 'knex';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

Model.knex(knex(knexConfig));
dotenv.config();
const port = process.env.PORT || 9999;
const app = express();
app.locals.baseURL = `${process.env.BASE_URL}:${port}`;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.listen(port, () => {
  console.log(`Server running on ${app.locals.baseURL}`);
});
