import { twitchApi } from '../../../api/twitchApi';
import { NotFoundError, ServerError } from '../../../errors';
import { TwitchTokenStore } from '../../../TwitchTokenStore';

export const getUserDetailsHandler = async (id: string) => {
  const twitchCredentials = await TwitchTokenStore.getInstance().getCredentials();
  const usersResponse = await twitchApi.getUsers([id], twitchCredentials);

  if (usersResponse.error) {
    console.error(usersResponse.error);
    throw new ServerError(`Unable to get user details from twitch fro user ${id}`);
  }

  const user = usersResponse.data!.data.find(user => user.id === id);
  if (!user) throw new NotFoundError('User not found');
  return user;
};
