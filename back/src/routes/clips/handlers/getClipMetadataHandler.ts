import { TwitchApi } from '../../../api/twitchApi';

export const getClipMetadataHandler = async (id: string, twitchApi: TwitchApi) => {
  return await twitchApi.getClipMetadata(id);
};