import { TwitchApi } from "../api/twitchApi";
import { TwitchClipFilters } from "../api/twitchApi/types";

export const getClipsFromChannelHandler = async (filters: TwitchClipFilters, twitchApi: TwitchApi) => {
  return await twitchApi.getClips(filters);
}