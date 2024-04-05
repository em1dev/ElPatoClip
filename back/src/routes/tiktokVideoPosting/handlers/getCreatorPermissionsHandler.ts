import { getConnections } from '../../../api/authApi';
import { TiktokApi } from '../../../api/tiktokApi';
import { NotFoundError } from '../../../errors';

export const getCreatorPermissionsHandler = async (userId: number) => {
  const connections = await getConnections(userId);
  if (!connections) throw new NotFoundError('User does not have connections');
  const tiktokConnection = connections.find(item => item.type === 'tiktok');
  if (!tiktokConnection) throw new NotFoundError('User does not have a tiktok connection');

  const resp = await TiktokApi.getCreatorPermissions(tiktokConnection.token);
  return resp;
};