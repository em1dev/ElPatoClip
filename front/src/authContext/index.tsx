import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeJwt } from 'jose';
import { ElPatoApi } from '../api/elPatoClipApi';


export type UserContextState = {
  isLoading: boolean,
  isAuthorized: true,
  user: User,
  token: string,
  logOut: () => void,
  setUserState: React.Dispatch<React.SetStateAction<{
    user: User,
    token: string
  } | null>>
} | {
  isLoading: boolean,
  isAuthorized: false,
  user?: undefined,
  token?: undefined,
  logOut?: undefined
  setUserState: React.Dispatch<React.SetStateAction<{
    user: User,
    token: string
  } | null>>
}

export interface User {
  app: string,
  id: number,
  provider: {
    type: string,
    userId: string,
    userLogin: string,
    displayName: string,
    profileImageUrl: string,
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext<UserContextState | null>(null);

export const LOCAL_STORAGE_KEY = 'EL_PATO_CLIP_USER';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<{ user: User, token: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logOut = useCallback(() => {
    setState(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true);
      // load from local storage
      const token = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      const isValid = await ElPatoApi.validateToken(token);
      if (!isValid) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setIsLoading(false);
        return;
      }
      const user = decodeJwt<User>(token);
      setState({ token, user });
      setIsLoading(false);
    };

    const onStorageChange = async (e: StorageEvent) => {
      if (e.key !== LOCAL_STORAGE_KEY) return;
      await loadToken();
    };

    window.addEventListener('storage', onStorageChange);

    loadToken();

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };

  }, []);

  const exposedState: UserContextState = state ? {
    logOut,
    setUserState: setState,
    isAuthorized: true,
    token: state.token,
    user: state.user,
    isLoading
  } : {
    setUserState: setState,
    isAuthorized: false,
    isLoading
  };

  return (
    <userContext.Provider value={exposedState}>
      {children}
    </userContext.Provider>
  );
};
