import { TwitchApi } from '../../../api/twitchApi';
import { NotFoundError } from '../../../errors';

export const getUserDetailsHandler = async (id: string, twitchApi: TwitchApi) => {
  const users = await twitchApi.getUsers([id]);
  const user = users.find((user) => user.id === id);
  if (!user) throw new NotFoundError('User not found');
  return user;
};