import * as S from './styles';
import { useEffect } from 'react';
import { useAuth } from '../../../authContext/useAuth';
import { useNavigate } from 'react-router-dom';
import { ConnectionButton } from '../../Molecules/ConnectionButton';
import { serviceToDetailsMap } from './serviceToDetailsMap';


export const AccountPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthorized) {
      navigate('/');
      return;
    }
  }, [auth, navigate]);

  if (!auth.isAuthorized) return null;

  const loggedInProvider = serviceToDetailsMap[auth.user.provider.type];

  return (
    <S.Card>
      <h1>Account</h1>

      <S.ProfileDetails>
        <S.ProfileImage height={80} alt="" src={auth.user.provider.profileImageUrl} />
        <div>
          <p>{auth.user.provider.displayName}</p>
          <div>
            <img height={18} src={loggedInProvider.imgUrl} alt="" />
            <span>Logged in with {loggedInProvider.display}</span>
          </div>
        </div>

        <button title='Log out' onClick={auth.logOut}>
          <img alt="" height={18} src='/icons/MingcuteCloseFill.svg' />
        </button>
      </S.ProfileDetails>

      <h2>Connections</h2>
      <p>Upload your clips to</p>

      <S.ConnectionButtonContainer>
        <ConnectionButton type="tiktok" />
      </S.ConnectionButtonContainer>
    </S.Card>
  );
};