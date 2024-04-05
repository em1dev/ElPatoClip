import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loading } from '../../Atoms/Loading';
import { useEffect, useState } from 'react';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { LOCAL_STORAGE_KEY } from '../../../authContext';
import { useAuth } from '../../../authContext/useAuth';
import styled from 'styled-components';
import { createRedirectUrl } from '../../../Utils/TokenAuthorizationBuilder';

const Container = styled.section`
  margin-top: 8em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AuthPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [ success, setSuccess ] = useState<boolean>(false);
  const [ hasError, setHasError ] = useState<boolean>(false);
  const { authService, action } = useParams<{ authService: string, action: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  if (authService !== 'tiktok' &&
      authService !== 'twitch') throw new Error('invalid authentication service');

  if (action !== 'auth' &&
      action !== 'connect') throw new Error('invalid action');

  const closeWindow = () => {
    window.setTimeout(() => {
      window.close();
    }, 500);
  };

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    if (auth.isLoading) return;
    if (action === 'auth' && auth.isAuthorized) {
      setSuccess(true);
      closeWindow();
      return;
    }

    setSearchParams('');

    const redirectUrl = createRedirectUrl(authService, action);

    const connectUser = async () => {
      const token = auth.token;
      if (!token) {
        setHasError(true);
        return;
      }
      const resp = await ElPatoApi.createConnection(token, authService, redirectUrl, code);
      if (resp.error) {
        setHasError(true);
        return;
      }

      setSuccess(true);
      closeWindow();
    };

    const authenticate = async () => {
      try {
        const resp = await ElPatoApi.authenticate(code, authService, redirectUrl);

        if (resp.error) {
          setHasError(true);
          return;
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, resp.data.token);
        setSuccess(true);
        closeWindow();
      } catch (e) {
        setHasError(true);
      }
    };

    if (action === 'connect') {
      connectUser();
      return;
    }

    if (action === 'auth') {
      authenticate();
    }
  }, [auth, authService, navigate, searchParams, setSearchParams, action]);

  if (
    authService !== 'tiktok' &&
    authService !== 'twitch'
  ) return (
    <Container>
      <h1>404 Not found</h1>
    </Container>
  );

  if (success) return (
    <Container>Logged in</Container>
  );

  if (hasError) return (
    <Container>
      <h1>Error authenticating, please try again later</h1>
    </Container>
  );

  return (
    <Container>
      <Loading />
    </Container>
  );
};