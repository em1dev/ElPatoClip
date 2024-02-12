import { ChannelSearchResponse, ClipListRequestFilters, ClipsResponse, UserDetails  } from "./types";

const baseApi = 'http://localhost:3000/';

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

const getClip = async (clipId: string) => {
  const resp = await fetch(`${baseApi}clip/${clipId}`);
  return resp.blob();
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