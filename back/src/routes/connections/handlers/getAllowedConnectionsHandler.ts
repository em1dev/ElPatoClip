import { getConnections } from '../../../api/authApi';
import { BadRequestError } from '../../../errors';

const allowedConnections = ['tiktok'];

export const getAllowedConnectionsHandler = async (userId: number, connectionType: string) => {
  if (!allowedConnections.includes(connectionType)) throw new BadRequestError('Invalid connection type');

  const connections = await getConnections(userId);
  if (!connections) throw new BadRequestError('Unable to get user connections');

  const foundConnection = connections
    .find(connection => connection.type === connectionType);

  if (!foundConnection) return;

  return ({
    type: foundConnection.type,
    displayName: foundConnection.displayName,
    profileImageUrl: foundConnection.profileImageUrl
  });
};