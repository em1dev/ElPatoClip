import { ConnectionServices, createConnection } from '../../../api/authApi';
import { BadRequestError } from '../../../errors';

export const postConnectionHandler = async (userId: number, connectionType: ConnectionServices, code: string, redirectUrl: string) => {
  const success = await createConnection(userId, connectionType, code, redirectUrl);
  if (success) return true;
  throw new BadRequestError('Unable to connect');
};