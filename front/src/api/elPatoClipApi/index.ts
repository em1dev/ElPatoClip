import { Clip, ClipListRequestFilters } from "./types";

const baseApi = 'http://localhost:3000/';

const getClips = async (channelName: string, filters: ClipListRequestFilters) => {
  const resp = await fetch(`${baseApi}${channelName}`, {
    method: 'POST',
    body: JSON.stringify(filters),
    headers: {
      'content-type': 'application/json',
    }
  });
  return (await resp.json()) as Array<Clip>;
};

const getClip = async (clipId: string) => {
  const resp = await fetch(`${baseApi}clip/${clipId}`);
  return resp.blob();
}

export const ClipApi = {
  getClips,
  getClip
}