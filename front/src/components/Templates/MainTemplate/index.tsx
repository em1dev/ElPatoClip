import { Link } from 'react-router-dom';
import * as S from './styles';

export interface MainTemplateProps {
  children: React.ReactNode;
  withHeader?: boolean,
}

const MainTemplate = (props: MainTemplateProps) => (
  <>
    {props.withHeader &&  (
      <S.HeaderContainer>
        <S.Header>
          <div>
            <S.HeaderLogo to='/'>
              <img height={23} src="/icons/loading.png" alt="el pato clip" />
              El Pato Clip
            </S.HeaderLogo>
          </div>

          <S.Links>
            <Link to='/privacy'>Privacy</Link>
            <Link to='/tos'>ToS</Link>
            <Link target='_blank' to='https://github.com/Niv3K-El-Pato/ElPatoClip'>Source Code</Link>
            <Link target='_blank' to='https://ko-fi.com/niv3k_el_pato'>Support Me :3</Link>
          </S.Links>
        </S.Header>
      </S.HeaderContainer>
    )}

    <S.Container>
      {props.children}
    </S.Container>
  </>
);

export default MainTemplate;