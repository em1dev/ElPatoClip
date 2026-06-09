import { getAppCredentials } from '../api/authApi';
import { twitchApi } from '../api/twitchApi';

export interface TwitchCredentials
{
  clientId: string,
  clientSecret: string,
  appToken: string
}

export class TwitchTokenStore {
  private static _instance: TwitchTokenStore | null = null;
  private _twitchCredentials: TwitchCredentials | null = null;

  public static getInstance = () => {
    if (this._instance == null) {
      this._instance = new TwitchTokenStore();
    }
    return this._instance;
  };

  public getCredentials = async (): Promise<TwitchCredentials> => {
    if (!this._twitchCredentials) {
      const result = await getAppCredentials();
      const tokenResult = await twitchApi.getAppToken(result.clientId, result.clientSecret);

      if (tokenResult.error || tokenResult.data == null)
      {
        throw new Error(`Failed twitch authentication. Reason ${tokenResult.error}`);
      }

      this._twitchCredentials = {
        clientId: result.clientId,
        clientSecret: result.clientSecret,
        appToken: tokenResult.data.access_token
      };
    }

    const tokenVerificationResp = await twitchApi.verifyToken(this._twitchCredentials.appToken);
    if (tokenVerificationResp.error) {
      console.log('Expired app token...refreshing.', tokenVerificationResp);
      return await this.getCredentials();
    }

    return this._twitchCredentials;
  };
}
