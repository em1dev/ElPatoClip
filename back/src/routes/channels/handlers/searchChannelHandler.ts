import { TwitchApi } from '../../../api/twitchApi';

export interface ChannelSearchResponse {
  id: string,
  displayName: string,
  profileImg: string
}

export const searchChannelHandler = async (searchString: string, twitchApi: TwitchApi) => {
  const resp = await twitchApi.searchChannel(searchString);
  const searchResponse: Array<ChannelSearchResponse> = resp.data.map(item => ({
    displayName: item.display_name,
    id: item.id,
    profileImg: item.thumbnail_url
  }));

  return searchResponse;
};