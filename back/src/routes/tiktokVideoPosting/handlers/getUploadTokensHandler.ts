import { getConnections } from '../../../api/authApi';


export const getUploadTokensHandler = async (connectionType: string, userId: number) => {
  const connections = await getConnections(userId) ?? [];
  const uploadConnection = connections.find(connection => connection.type === connectionType);

  return uploadConnection;
};