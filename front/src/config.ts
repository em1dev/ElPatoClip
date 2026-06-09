export const config = {
  API_URL: import.meta.env.VITE_API_URL
};

if (!config.API_URL) {
  throw new Error('Missing env file');
}

export const STORAGE_KEYS = {
  recentItems: 'recent-items'
};

export const IS_CLIENT_UNAUDITED = false;
