import { config } from '../../config';

export enum LoginServices {
  tiktok = 'tiktok',
  twitch = 'twitch'
}

export enum ConnectionServices {
  tiktok = 'tiktok',
}

export const getAppCredentials = async () => {
  const url = `${config.AUTH_URL}/app/${config.APP_ID}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(
      `Unable to get app authentication information from auth server. Status: ${resp.status}.
Make sure an app with '${config.APP_ID}' exists within the auth server.`
    );
  }

  const credentials = await resp.json() as Array<{
    type: string,
    clientSecret: string,
    clientId: string
  }>;
  const twitchCredentials = credentials.find(item => item.type == LoginServices.twitch);
  if (!twitchCredentials) {
    throw new Error(`Missing twitch credentials on auth server for app '${config.APP_ID}'`);
  }

  return twitchCredentials;
};

export const authenticate = async (code: string, service: LoginServices, redirectUrl: string) => {
  const resp = await fetch(config.AUTH_URL + `/${config.APP_ID}/authenticate/${service}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirectUrl
    })
  });

  if (resp.ok) {
    return await resp.json();
  }
};

export const verifyTokenApi = async (token: string) => {
  const resp = await fetch(config.AUTH_URL + '/token/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token })
  });
  return resp.ok;
};

export interface ElPatoConnection {
  token: string,
  refreshToken: string,
  userId: string,
  type: 'tiktok' | 'twitch' | 'youtube',
  displayName: string,
  profileImageUrl: string
}

export const getConnections = async (userId: number) => {
  const resp = await fetch(config.AUTH_URL + `/${config.APP_ID}/user/${userId}/connections`);
  if (!resp.ok) return;

  return await resp.json() as Array<ElPatoConnection>;
};

export const deleteConnection = async (userId: number, connectionType: ConnectionServices) => {
  const resp = await fetch(`${config.AUTH_URL}/${config.APP_ID}/user/${userId}/connection/${connectionType}`, {
    method: 'DELETE'
  });
  return resp.ok;
};

export const createConnection = async (userId: number, connectionType: ConnectionServices, code: string, redirectUrl: string) => {
  const resp = await fetch(`${config.AUTH_URL}/${config.APP_ID}/user/${userId}/connection/${connectionType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirectUrl
    })
  });
  return resp.ok;
};
