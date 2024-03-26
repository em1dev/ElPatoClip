import { GlqClipInfoResponse } from './types';

const BASE_URL = 'https://gql.twitch.tv/gql';
const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';
const HASH = '6e465bb8446e2391644cf079851c0cb1b96928435a240f07ed4b240f0acc6f1b';

const downloadClip = async (clipId: string, hash: string = HASH) => {

  const data = [
    {
      operationName: 'ClipsDownloadButton',
      variables: {
        slug: clipId,
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: hash,
        }
      },
    }
  ];

  const resp = await fetch(BASE_URL, {
    method: 'POST',
    headers: new Headers({
      'Client-ID': CLIENT_ID,
      'content-type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
  const respData = await resp.json() as GlqClipInfoResponse;
  const clip = respData[0].data.clip;
  if (!clip) {
    throw new Error('clip not found');
  }

  console.log(clip);
  let clipUrl = clip.videoQualities.at(0)?.sourceURL;
  if (!clipUrl) {
    throw new Error('clip quality not found');
  }
  clipUrl = `${clipUrl}?sig=${clip.playbackAccessToken.signature}&token=${encodeURIComponent(clip.playbackAccessToken.value)}`;
  const clipResp = await fetch(clipUrl);
  return clipResp.blob();
};

export const TwitchApi = {
  downloadClip
};