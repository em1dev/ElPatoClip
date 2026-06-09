import { twitchApi } from '../../../api/twitchApi';
import { ServerError } from '../../../errors';
import { TwitchTokenStore } from '../../../TwitchTokenStore';

export interface ChannelSearchResponse {
  id: string,
  displayName: string,
  profileImg: string
}

export const searchChannelHandler = async (searchString: string) => {
  const twitchCredentials = await TwitchTokenStore.getInstance().getCredentials();
  const searchResponse = await twitchApi.searchChannel(twitchCredentials, searchString);

  if (searchResponse.error) {
    console.error(searchResponse.error);
    throw new ServerError('Unable to get user details from twitch');
  }

  const result: Array<ChannelSearchResponse> = searchResponse.data!.data.map(item => ({
    displayName: item.display_name,
    id: item.id,
    profileImg: item.thumbnail_url
  }));

  return result;
};
