import { IncomingHttpHeaders } from 'http';
import { decodeJwt } from 'jose';
import { z } from 'zod';
import { verifyTokenApi } from './api/authApi';

export const getUserIdFromToken = async (headers: IncomingHttpHeaders) => {
  try {
    const token = await getTokenIfValid(headers);
    if (!token) return;
    const tokenPayload = decodeJwt(token);
    const userId = z.number().parse(tokenPayload['id']);
    return userId;
  } catch {
    return;
  }
};

export const getTokenIfValid = async (headers: IncomingHttpHeaders) => {
  const token = headers.authorization?.split(' ').at(1);
  if (!token) return;
  if (await verifyTokenApi(token)) {
    return token;
  }
};