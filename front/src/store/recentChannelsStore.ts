import { ChannelSearchResponse } from "../api/elPatoClipApi/types";
import { STORAGE_KEYS } from "../config";

const MAX_ITEMS = 5;

const store = (channel: ChannelSearchResponse) => {
    const storedData = localStorage.getItem(STORAGE_KEYS.recentItems);
    let recentChannels:Array<ChannelSearchResponse> = [];
    if (storedData) {
      recentChannels = JSON.parse(storedData);
      recentChannels = recentChannels
        .filter(item => item.id !== channel.id)
        .slice(0, MAX_ITEMS - 1);
    }
    recentChannels = [channel, ...recentChannels];
    localStorage.setItem(STORAGE_KEYS.recentItems, JSON.stringify(recentChannels));
}

const load = () => {
  const storedRecentItems = localStorage.getItem(STORAGE_KEYS.recentItems);
  let recentItems: Array<ChannelSearchResponse> = [];
  if (storedRecentItems) {
    recentItems = JSON.parse(storedRecentItems) as Array<ChannelSearchResponse>;
  }
  return recentItems;
}

export const recentChannelsStore = {
  load,
  store
}