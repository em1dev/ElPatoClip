import * as S from './styles';
import { ElPatoConnection } from '../../../api/elPatoClipApi/types';
import { serviceToDetailsMap } from '../../Pages/AccountPage/serviceToDetailsMap';
import { Button } from '../../Atoms/Button';
import { useCallback, useEffect, useState } from 'react';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { useAuth } from '../../../authContext/useAuth';
import { createTokenUrl } from '../../../Utils/TokenAuthorizationBuilder';
import { ApiResponse } from '../../../api/types';

export interface ConnectionButtonProps {
  type: 'twitch' | 'tiktok'
  onChange?: (value: ApiResponse<ElPatoConnection> | null) => void,
}

export const ConnectionButton = ({ type, onChange }: ConnectionButtonProps) => {
  const [shouldListenForFocus, setShouldListenForFocus] = useState<boolean>(false);
  const auth = useAuth();
  const [{ isLoading, connection }, setState] = useState<{
    isLoading: boolean,
    connection?: ApiResponse<ElPatoConnection> | null
  }>({ isLoading: true });

  const load = useCallback(async (cancelToken?: { cancel: boolean }) => {
    if (auth.isLoading || !auth.isAuthorized) return;
    setState(prev => ({ ...prev, isLoading: true }));
    const result = await ElPatoApi.getConnectionDetails(auth.token, type);
    if (cancelToken?.cancel) return;
    setState({ isLoading: false, connection: result });
    onChange && onChange(result);
  }, [auth, type, onChange]);

  useEffect(() => {
    load();
  }, [load]);

  const onDisconnect = useCallback(async () => {
    if (!auth.token) return;
    const resp = await ElPatoApi.deleteConnection(auth.token, type);
    if (resp.error) return;
    // TODO - show error
    load();
  }, [auth, type, load]);

  const onConnect = useCallback(() => {
    const url = createTokenUrl(type, 'connect');
    window.open(url, 'popup', 'toolbar=0,status=0,width=626,height=436');
    setShouldListenForFocus(true);
  }, [type]);

  useEffect(() => {
    const cancelToken = { cancel: false };
    let timeoutRef:NodeJS.Timeout | null = null;

    // once we have a connection stop refreshing
    if (connection?.data) return;

    const onFocus = () => {
      if (!shouldListenForFocus) return;

      if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
      }

      timeoutRef = setTimeout(async () => {
        await load(cancelToken);
      }, 800);
    };

    window.addEventListener('focus', onFocus);

    return () => {
      cancelToken.cancel = true;
      window.removeEventListener('focus', onFocus);
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };

  }, [load, shouldListenForFocus, connection]);

  const connectionDetails = serviceToDetailsMap[type];

  if (!connection || connection.status === 404) return (
    <S.ConnectButton disabled={isLoading} onClick={onConnect}>
      <img alt="" src={connectionDetails.imgUrl} height={20} width={20} ></img>
      Connect with {connectionDetails.display}
    </S.ConnectButton>
  );

  if (connection.error) return (
    <S.ExistingConnectionContainer>
      Error loading connection. Please try again later
    </S.ExistingConnectionContainer>
  );

  return (
    <S.ExistingConnectionContainer>
      <img alt="" src={connection.data.profileImageUrl} height={60} width={60} ></img>
      <div>
        {connection.data.displayName}
        <div>
          <img alt="" src={connectionDetails.imgUrl} height={20} width={20} ></img>
        Linked with {connectionDetails.display}
        </div>
      </div>
      <Button $variant='secondary' disabled={isLoading} onClick={onDisconnect}>
        Disconnect
      </Button>
    </S.ExistingConnectionContainer>
  );
};