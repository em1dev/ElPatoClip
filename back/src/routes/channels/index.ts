import { app, handleError } from '../..';
import { TwitchApi } from '../../api/twitchApi';
import { BadRequestError } from '../../errors';
import { getUserDetailsHandler } from './handlers/getUserDetailsHandler';
import { searchChannelHandler } from './handlers/searchChannelHandler';

const twitchApi = new TwitchApi();

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