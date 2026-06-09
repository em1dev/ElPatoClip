import { ApiResponse } from '../types';
import {
  TwitchTokenVerificationResponse, AuthenticationResponse,
  TwitchClip, TwitchClipFilters, TwitchPaginatedResult, UserDetails,
  ChannelDetails
} from './types';
import { TwitchCredentials } from '../../TwitchTokenStore';

const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

const verifyToken = async (token: string) => (
  await callApi<TwitchTokenVerificationResponse>({
    url: 'https://id.twitch.tv/oauth2/validate',
    method: 'GET',
    twitchCredentials: {
      appToken: token,
      clientId: '',
      clientSecret: ''
    }
  })
);

const getAppToken = async (clientId: string, clientSecret: string) => (
  await callApi<AuthenticationResponse>({
    url: TWITCH_AUTH_URL,
    method: 'POST',
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      claims: '',
    }
  })
);

const getClipMetadata = async (clipId: string, credentials: TwitchCredentials) => (
  callApi<TwitchPaginatedResult<TwitchClip>>({
    url: 'https://api.twitch.tv/helix/clips',
    params: {
      id: clipId
    },
    twitchCredentials: credentials,
  })
);

const getClips = async (filters: TwitchClipFilters, credentials: TwitchCredentials) => {
  const sanitizedParams:Record<string, string | boolean> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined) return;
    sanitizedParams[key] = value;
  });

  return callApi<TwitchPaginatedResult<TwitchClip>>({
    url: 'https://api.twitch.tv/helix/clips',
    params: sanitizedParams,
    twitchCredentials: credentials
  });
};

const searchChannel = async (credentials: TwitchCredentials, searchString: string, first: number = 5) => (
  callApi<TwitchPaginatedResult<ChannelDetails>>({
    url: 'https://api.twitch.tv/helix/search/channels',
    params: {
      query: searchString,
      first
    },
    twitchCredentials: credentials
  })
);

const getUsers = async (userIds: Array<string>, credentials: TwitchCredentials) => {
  if (userIds.length === 0) return {
    data: {
      data: []
    }
  } as ApiResponse<{ data: Array<UserDetails> }>;

  let url = 'https://api.twitch.tv/helix/users?';
  const params = userIds.map(s => `id=${s}`).join('&');
  url += params;

  return callApi<{ data: Array<UserDetails>}>({
    url,
    twitchCredentials: credentials
  });
};

interface ApiParams<T> {
  url: string;
  params?: Record<string, string | number | boolean>;
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
  body?: T;
  twitchCredentials?: TwitchCredentials;
  headers?: Record<string, string>,
}

const callApi = async <R, T = unknown>({
  url,
  body,
  method = 'GET',
  params = {},
  twitchCredentials
}: ApiParams<T>): Promise<ApiResponse<R>> => {
  const paramsParsed = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');

  let urlParsed = url;
  if (paramsParsed) {
    urlParsed += '?' + paramsParsed;
  }
  try {
    const resp = await fetch(urlParsed, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: twitchCredentials ? createAuthHeaders(twitchCredentials) : {
        'Content-Type': 'application/json',
      },
    });
    const data = await resp.json() as R;

    if (!resp.ok) {
      console.error(data, resp.status);
      return {
        error: {
          status: resp.status,
          description: data as unknown
        }
      };
    }

    return { data };
  } catch (err) {
    console.log(err);
    return {
      error: {
        status: 500,
        description: 'Internal error'
      }
    };
  }
};

const createAuthHeaders = (
  twitchCredentials: TwitchCredentials,
  type: 'Bearer' | 'OAuth' = 'Bearer',
  additionalHeaders: Record<string, string> = {}) => (
  new Headers({
    'Client-Id': twitchCredentials.clientId,
    'Authorization': `${type} ${twitchCredentials.appToken}`,
    'Content-Type': 'application/json',
    ...additionalHeaders
  })
);

export const twitchApi = {
  getAppToken,
  verifyToken,
  getUsers,
  searchChannel,
  getClips,
  getClipMetadata
};
