import { app, handleError } from '../..';
import { TwitchApi } from '../../api/twitchApi';
import { TwitchGqlApi } from '../../api/twitchGqlApi';
import { BadRequestError } from '../../errors';
import { downloadClipHandler } from './handlers/downloadClipHandler';
import { getClipMetadataHandler } from './handlers/getClipMetadataHandler';
import { getClipsFromChannelHandler } from './handlers/getClipsFromChannelHandler';
import { ClipListRequestFiltersSchema } from './schema';

const twitchGqlApi = new TwitchGqlApi();
const twitchApi = new TwitchApi();

app.get('/clip/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id.length) throw new BadRequestError('Missing Id');
    await downloadClipHandler(id, twitchGqlApi, res);
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/clip/metadata/:id', async (req, res) => {
  try {
    const data = await getClipMetadataHandler(req.params.id, twitchApi);
    res.send(data);
  } catch (err) {
    console.log(err);
    handleError(err, res);
  }
});

app.post('/channel/:channelId/clips', async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const filters = ClipListRequestFiltersSchema.parse(req.body);
    const data = await getClipsFromChannelHandler(channelId, filters, twitchApi);
    res.send(data);
  } catch (err) {
    console.log(err);
    handleError(err, res);
  }
});