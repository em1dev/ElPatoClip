import { z } from 'zod';
import { app, handleError } from '../..';
import { loginHandler } from './handlers/loginHandler';
import { LoginServices } from '../../api/authApi';
import { getTokenIfValid } from '../../getUserFromToken';

app.post('/login', async (req, res) => {
  try {
    const { code, provider, redirectUrl } = z.object({
      code: z.string(),
      provider: z.nativeEnum(LoginServices),
      redirectUrl: z.string()
    }).parse(req.body);

    const user = await loginHandler(code, provider, redirectUrl);

    if (!user) {
      res.status(401).send();
    }

    res.status(200).send(user);
  } catch(err) {
    handleError(err, res);
  }
});

app.post('/token/verify', async (req, res) => {
  try {
    const isValid = await getTokenIfValid(req.headers);
    if (!isValid) return res.status(401).send();
    return res.status(200).send();
  } catch (err) {
    handleError(err, res);
  }
});