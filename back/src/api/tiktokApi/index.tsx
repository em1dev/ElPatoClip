import { PostInfo, PostVideoRequest } from "./types";

const BASE_URL = '';

/**
 * video.publish
 */
const postVideo = async (video:string, postOptions: PostInfo, token: string) => {
  // todo - calculate chunks
  // 5 MB but no greater than 64 MB
  // last chunk max 128mb

  const url = BASE_URL + '/v2/post/publish/video/init/';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      post_info: postOptions,
      source_info: {
        source: 'FILE_UPLOAD',
        chunk_size: 0,
        total_chunk_count: 0,
        video_size: 0,
      }
    } satisfies PostVideoRequest)
  });
};