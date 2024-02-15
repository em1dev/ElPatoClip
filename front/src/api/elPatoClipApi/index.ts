import { readBlob } from "./responseReaders";
import { ChannelSearchResponse, ClipListRequestFilters, ClipsResponse, UserDetails  } from "./types";

const baseApi = import.meta.env.MODE === 'production' ?  'https://api.niv3kelpato.com/clipApi/' : 'http://localhost:3000/';

const getClips = async (channelName: string, filters: ClipListRequestFilters) => {
  const resp = await fetch(`${baseApi}channel/${channelName}/clips`, {
    method: 'POST',
    body: JSON.stringify(filters),
    headers: {
      'content-type': 'application/json',
    }
  });
  return (await resp.json()) as ClipsResponse;
};

const getChannelDetails = async (channelId: string) => {
  const resp = await fetch(`${baseApi}channel/${channelId}`);
  return await resp.json() as UserDetails;
}

const getClip = async (clipId: string, onProgress: (progress: number, total:number) => void) => {
  const resp = await fetch(`${baseApi}clip/${clipId}`);
  return await readBlob(resp, onProgress);
}

const searchUser = async (searchString: string) => {
  const resp = await fetch(`${baseApi}channels?search=${searchString}`);
  return await resp.json() as Array<ChannelSearchResponse>;
}

export const ElPatoApi = {
  getClips,
  getClip,
  searchUser,
  getChannelDetails
}