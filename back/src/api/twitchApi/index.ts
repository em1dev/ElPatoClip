import { URL } from 'url';
import { env } from '../../env';
import { AuthenticationResponse, ChannelDetails, TwitchClip, TwitchClipFilters, TwitchPaginatedResult, UserDetails } from './types';
import { BadRequestError } from '../../errors';

export class TwitchApi {
  private getAppToken = async () => {
    const url = 'https://id.twitch.tv/oauth2/token';
    const body = {
      'client_id': env.clientId,
      'client_secret': env.clientSecret,
      'grant_type': 'client_credentials'
    };

    const resp = await fetch(url, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!resp.ok) { throw new Error('Invalid token'); }
    const data = await resp.json() as AuthenticationResponse;
    return data.access_token;
  };

  public getClipMetadata = async (clipId: string) => {
    const token = await this.getAppToken();
    const url = new URL(`https://api.twitch.tv/helix/clips?id=${clipId}`);
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': `${env.clientId}`
      }
    });

    if (!resp.ok) {
      console.error('Unable to get twitch clips', resp.status);
      const error = await resp.text();
      console.error(error);
      throw new BadRequestError(`twitch api error: ${resp.status}`);
    }

    return await resp.json() as TwitchPaginatedResult<TwitchClip>;
  };

  public getClips = async (filters: TwitchClipFilters) => {
    const token = await this.getAppToken();
    const url = new URL('https://api.twitch.tv/helix/clips');
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined) return;
      params.set(key, String(value));
    });
    url.search = params.toString();

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': `${env.clientId}`
      }
    });

    if (!resp.ok) {
      console.error('Unable to get twitch clips', resp.status);
      const error = await resp.text();
      console.error(error);
      throw new BadRequestError(`twitch api error: ${resp.status}`);
    }

    return await resp.json() as TwitchPaginatedResult<TwitchClip>;
  };

  public searchChannel = async (searchString: string, first: number = 5) => {
    const url = `https://api.twitch.tv/helix/search/channels?query=${searchString}&first=${first}`;
    const token = await this.getAppToken();

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': `${env.clientId}`
      }
    });

    if (!resp.ok) throw new Error(`twitch api error: ${resp.status}`);

    const data = await resp.json() as TwitchPaginatedResult<ChannelDetails>;
    return data;
  };

  public getUsers = async (userIds: Array<string>) => {
    if (userIds.length === 0) return [];

    let url = 'https://api.twitch.tv/helix/users?';
    const params = userIds.map(s => `id=${s}`).join('&');
    url += params;

    const token = await this.getAppToken();

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': `${env.clientId}`
      }
    });

    if (!resp.ok) {
      console.log(await resp.json());
      throw new Error(`Twitch api error ${resp.status}`);
    }

    const { data } = await resp.json() as { data: Array<UserDetails> };
    return data;
  };
}