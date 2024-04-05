import { CreatorPublishPermissionResponse, PostVideoRequest } from './types';


/**
 * video.publish
 */
const initiateVideo = async (postOptions: PostVideoRequest, token: string) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/video/init/';

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postOptions)
  });

  const data = await resp.json() as {
    data: {
      publish_id?: string,
      upload_url?: string
    },
    error: {
      code: string,
      message: string,
      logId: string
    }
  };

  return {
    payload: data,
    status: resp.status
  };
};

const getUploadStatus = async (videoId: string, token: string) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      publish_id: videoId
    })
  });

  return resp;
};

const getCreatorPermissions = async (token: string) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8'
    }
  });


  return await resp.json() as CreatorPublishPermissionResponse;
};

export const TiktokApi = {
  initiateVideo,
  getUploadStatus,
  getCreatorPermissions
};