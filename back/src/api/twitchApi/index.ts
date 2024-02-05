import { URL } from 'url';
import { env } from '../../env';
import { AuthenticationResponse, TwitchClip, TwitchClipFilters } from './types';

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
  }

  public getClips = async (filters: TwitchClipFilters) => {
    const token = await this.getAppToken();
    const url = new URL('https://api.twitch.tv/helix/clips');
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined) return;
      params.set(key, String(value))
    });
    console.log(params);
    url.search = params.toString();

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': `${env.clientId}`
      }
    });

    if (!resp.ok) throw new Error(`twitch api error: ${resp.status}`);

    const { data } = await resp.json() as { data: Array<TwitchClip> }
    return data;
  }
}