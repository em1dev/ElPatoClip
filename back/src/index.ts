import express, { Response } from 'express';
import { HttpErrorBase } from './errors';
import { config } from './config';
import cors from 'cors';

export const app = express();

app.use(express.json());

app.use(cors());

app.get('/health', (_, res) => {
  res.status(200).send();
});

app.use('/', (req, _, next) => {
  console.log(`[${req.method}] - ${req.path}`);
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('query:', Object.entries(req.query));
  }

  if (req.body && Object.keys(req.body).length > 0) {
    console.log('body:', req.body.code ? {...req.body, code: '***'} : req.body);
  }
  next();
});

export const handleError = (err: unknown, res: Response) => {
  console.log(err);
  if (err instanceof HttpErrorBase) {
    return res.status(err.status).send(err.description);
  }

  res.status(500).send();
};

import './routes/clips';
import './routes/login';
import './routes/tiktokVideoPosting';
import './routes/channels';
import './routes/connections';

app.listen(config.PORT, () => {
  console.log(`Started server at http://localhost:${config.PORT}`);
});
