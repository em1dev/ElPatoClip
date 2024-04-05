import express, { Response } from 'express';
import { HttpErrorBase } from './errors';
import { env } from './env';
import cors from 'cors';

const PORT = env.port;
export const app = express();

app.use(express.json());

app.use(cors());

app.use('/', (req, _, next) => {
  console.log(`[${req.method}] - ${req.path}`);
  if (Object.keys(req.query).length > 0) {
    console.log('query:', req.query);
  }

  if (Object.keys(req.body).length > 0) {
    console.log('body:', req.body.code ? {...req.body, code: '***'} : req.body);
  }
  next();
});

export const handleError = (err: unknown, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`Started server at http://localhost:${PORT}`);
});