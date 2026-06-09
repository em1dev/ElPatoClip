import { twitchApi } from '../../../api/twitchApi';
import { ServerError } from '../../../errors';
import { TwitchTokenStore } from '../../../TwitchTokenStore';

export const getClipMetadataHandler = async (id: string) => {
  const twitchCredentials = await TwitchTokenStore.getInstance().getCredentials();

  const clipResponse =  await twitchApi.getClipMetadata(id, twitchCredentials);

  if (clipResponse.error) {
    console.error(clipResponse.error);
    throw new ServerError('Unable to get user details from twitch');
  }

  return clipResponse.data!;
};
