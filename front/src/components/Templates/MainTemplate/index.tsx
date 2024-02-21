import { Link } from 'react-router-dom';
import * as S from './styles';

export interface MainTemplateProps {
  children: React.ReactNode;
  withHeader?: boolean,
}

const MainTemplate = (props: MainTemplateProps) => (
  <>
    <S.Header>
      {props.withHeader &&  (
        <S.HeaderLogo to='/'>
          <img height={23} src="/icons/loading.png" alt="el pato clip" />
          El Pato Clip
        </S.HeaderLogo>
      )}
    </S.Header>
    <S.Container>
      {props.children}
    </S.Container>
    <S.Footer>
      <Link to='/privacy'>Privacy</Link>
      <Link to='/tos'>ToS</Link>
      <Link target='_blank' to='https://github.com/Niv3K-El-Pato/ElPatoClip'>Source Code</Link>
      <Link target='_blank' to='https://ko-fi.com/niv3k_el_pato'>Support Me :3</Link>
    </S.Footer>
  </>
);

export default MainTemplate;