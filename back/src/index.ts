import express, { Response } from 'express';
import { TwitchGqlApi } from './api/twitchGqlApi';
import { Readable } from 'stream';
import { env } from './env';
import { TwitchClipFilters } from './api/twitchApi/types';
import { ClipListRequestFilters } from './api/contracts/requests';
import { TwitchApi } from './api/twitchApi';

const PORT = 3000;

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

app.get('/clip/:id', async (req, res: Response) => {
  const url = await twitchGqlApi.getDownloadClipUrl(req.params.id);
  if (!url) {
    res.status(404);
    return;
  }
  const resp = await fetch(url);
  if (!resp.body) return;

  const reader = resp.body.getReader()
  const stream = new Readable({
    read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          this.push(null)
        } else {
          this.push(value)
        }
      })
    },
  })

  res.set("Content-Type", "video/mp4")
  res.set("Accept-Ranges", "bytes")
  res.set("Connection", "keep-alive")
  res.set("Cache-Control", "no-cache")
  stream.pipe(res)
});

const mapToType = <T>(value: unknown, type: string) => {
  if (typeof value !== type) return;
  return value as T;
}

app.post('/:channelName', async (req, res) => {
  const channelName = req.params.channelName;
  const filters = req.body as ClipListRequestFilters;

  const twitchFilters: TwitchClipFilters = {
    broadcaster_id: channelName,
    first: mapToType<number>(filters.amount, 'number'),
    is_featured: mapToType<boolean>(filters.amount, 'boolean'),
    after: mapToType<string>(filters.afterCursor, 'string'),
  }

  res.send(JSON.stringify(await twitchApi.getClips(twitchFilters)));
});

app.listen(PORT, () => {
  console.log(`Started server at http://localhost:${PORT}`);
});