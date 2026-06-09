import { twitchApi } from '../../../api/twitchApi';
import { ServerError } from '../../../errors';
import { TwitchTokenStore } from '../../../TwitchTokenStore';
import { ClipListRequestFilters } from '../schema';

export const getClipsFromChannelHandler = async (channelId: string, filters: ClipListRequestFilters) => {
  const twitchCredentials = await TwitchTokenStore.getInstance().getCredentials();

  const clipsResponse = await twitchApi.getClips({
    broadcaster_id: channelId,
    after: filters.afterCursor,
    before: filters.beforeCursor,
    started_at: filters.startedAt,
    ended_at: filters.endedAt,
    first: filters.amount,
    is_featured: filters.isFeatured
  }, twitchCredentials);

  if (clipsResponse.error) {
    console.error(clipsResponse.error);
    throw new ServerError('Unable to get user details from twitch');
  }

  return clipsResponse.data!;
};
