import express from 'express';
import cron from 'node-cron';
import { updateIsExpiredToken } from './service/updateIsExpiredToken';

const app = express();
const port = 4545;

cron.schedule('* * * * *', () => {
  updateIsExpiredToken();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
