import { createTokenUrl } from '../../../Utils/TokenAuthorizationBuilder';
import * as S from './styles';


export const LoginPage = () => (
  <S.Page>
    <h1>Login</h1>
    <S.LoginLink href={createTokenUrl('tiktok', 'auth')}>
      <img height={23} src="/logos/tiktok.svg" alt="" />
        Sign in with TikTok
    </S.LoginLink>
    <S.LoginLink href={createTokenUrl('twitch', 'auth')}>
      <img height={23} src="/logos/twitch.svg" alt="" />
        Sign in with Twitch
    </S.LoginLink>
  </S.Page>
);