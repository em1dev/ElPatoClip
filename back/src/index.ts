import express, { Response } from 'express';
import { TwitchGqlApi } from './api/twitchGqlApi';
import { TwitchClipFilters } from './api/twitchApi/types';
import { ClipListRequestFilters } from './contracts/requests';
import { TwitchApi } from './api/twitchApi';
import { BadRequestError, HttpErrorBase } from './errors';
import { downloadClipHandler } from './handlers/downloadClipHandler';
import { getClipsFromChannelHandler } from './handlers/getClipsFromChannelHandler';
import { searchChannelHandler } from './handlers/searchChannelHandler';
import { getUserDetailsHandler } from './handlers/getUserDetailsHandler';
import { env } from './env';

const PORT = env.port;
const app = express();

const twitchGqlApi = new TwitchGqlApi();
const twitchApi = new TwitchApi();

app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(`[${req.method}] - ${req.path}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

const handleError = (err: unknown, res: Response) => {
  if (err instanceof HttpErrorBase) {
    return res.status(err.status).send(err.description);
  }

  res.status(500).send();
}

app.get('/clip/:id', async (req, res: Response) => {
  try {
    const id = req.params.id;
    if (!id.length) throw new BadRequestError('Missing Id');
    await downloadClipHandler(id, twitchGqlApi, res);
  } catch (err) {
    handleError(err, res);
  }
});

const mapToType = <T>(value: unknown, type: string) => {
  if (typeof value !== type) return;
  return value as T;
}

app.post('/channel/:channelId/clips', async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const filters = req.body as ClipListRequestFilters;

    const twitchFilters: TwitchClipFilters = {
      broadcaster_id: channelId,
      first: mapToType<number>(filters.amount, 'number'),
      is_featured: mapToType<boolean>(filters.amount, 'boolean'),
      after: mapToType<string>(filters.afterCursor, 'string'),
      started_at: mapToType<string>(filters.startedAt, 'string'),
      ended_at: mapToType<string>(filters.endedAt, 'string'),
    }

    const data = await getClipsFromChannelHandler(twitchFilters, twitchApi);
    res.send(data);
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/channels', async (req, res) => {
  try {
    const searchString = req.query['search'];
    if (typeof searchString !== 'string') return res.status(400).send();
    const searchResponse = await searchChannelHandler(searchString, twitchApi);
    res.json(searchResponse);
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/channel/:channelId', async (req, res) => {
  try {
    if (!req.params.channelId.length) throw new BadRequestError('Missing channel id');
    const user = await getUserDetailsHandler(req.params.channelId, twitchApi);
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
});

app.listen(PORT, () => {
  console.log(`Started server at http://localhost:${PORT}`);
});