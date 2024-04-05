import { getConnections } from '../../../api/authApi';
import { TiktokApi } from '../../../api/tiktokApi';
import { BadRequestError } from '../../../errors';

export const getUploadStatusHandler = async (userId: number, videoId: string) => {
  const userConnections = await getConnections(userId);
  if (!userConnections) throw new BadRequestError('User does not exist');

  const tiktokConnection = userConnections.find(item => item.type === 'tiktok');
  if (!tiktokConnection) throw new BadRequestError('User does not have a tiktok connection');

  return await TiktokApi.getUploadStatus(videoId, tiktokConnection.token);
};