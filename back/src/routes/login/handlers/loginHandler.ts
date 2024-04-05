import { LoginServices, authenticate } from '../../../api/authApi';

export const loginHandler = async (code: string, service: LoginServices, redirectUrl: string) => {
  return await authenticate(code, service, redirectUrl);
};