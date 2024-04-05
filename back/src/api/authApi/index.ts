import { env } from '../../env';

const BASE_URL = `http://localhost:${env.authPort}`;
const APP_ID = env.appName;

export enum LoginServices {
  tiktok = 'tiktok',
  twitch = 'twitch'
}

export enum ConnectionServices {
  tiktok = 'tiktok',
}

export const authenticate = async (code: string, service: LoginServices, redirectUrl: string) => {
  const resp = await fetch(BASE_URL + `/${APP_ID}/authenticate/${service}`, {
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
  const resp = await fetch(BASE_URL + '/token/verify', {
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
  const resp = await fetch(BASE_URL + `/${APP_ID}/user/${userId}/connections`);
  if (!resp.ok) return;

  return await resp.json() as Array<ElPatoConnection>;
};

export const deleteConnection = async (userId: number, connectionType: ConnectionServices) => {
  const resp = await fetch(`${BASE_URL}/${APP_ID}/user/${userId}/connection/${connectionType}`, {
    method: 'DELETE'
  });
  return resp.ok;
};

export const createConnection = async (userId: number, connectionType: ConnectionServices, code: string, redirectUrl: string) => {
  const resp = await fetch(`${BASE_URL}/${APP_ID}/user/${userId}/connection/${connectionType}`, {
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