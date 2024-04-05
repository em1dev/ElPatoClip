import { getConnections } from '../../../api/authApi';
import { TiktokApi } from '../../../api/tiktokApi';
import { PostVideoRequest } from '../../../api/tiktokApi/types';

export const initiateVideoUploadHandler = async (videoData: PostVideoRequest, userId: number) => {
  const userConnections = await getConnections(userId);
  if (!userConnections) return;

  const tiktokConnection = userConnections.find(item => item.type === 'tiktok');
  if (!tiktokConnection) return;

  const createdVideo = await TiktokApi.initiateVideo(videoData, tiktokConnection.token);
  return createdVideo;
};