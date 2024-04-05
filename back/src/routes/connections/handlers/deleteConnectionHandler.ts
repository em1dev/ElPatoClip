import { ConnectionServices, deleteConnection } from '../../../api/authApi';
import { BadRequestError } from '../../../errors';

export const deleteConnectionHandler = async (userId: number, connectionType: ConnectionServices) => {
  const isOk = await deleteConnection(userId, connectionType);
  if (!isOk) {
    throw new BadRequestError('Unable to delete connection');
  }
  return true;
};