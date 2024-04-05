import { useContext } from 'react';
import { userContext } from '.';

export const useAuth = () => {
  const auth = useContext(userContext);
  if (!auth) throw new Error('Missing auth context');
  return auth;
};