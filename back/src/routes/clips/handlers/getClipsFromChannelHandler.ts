import { TwitchApi } from '../../../api/twitchApi';
import { ClipListRequestFilters } from '../schema';

export const getClipsFromChannelHandler = async (channelId: string, filters: ClipListRequestFilters, twitchApi: TwitchApi) => {
  return await twitchApi.getClips({
    broadcaster_id: channelId,
    after: filters.afterCursor,
    before: filters.beforeCursor,
    started_at: filters.startedAt,
    ended_at: filters.endedAt,
    first: filters.amount,
    is_featured: filters.isFeatured
  });
};