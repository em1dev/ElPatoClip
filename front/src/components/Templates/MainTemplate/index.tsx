import { Link } from 'react-router-dom';
import * as S from './styles';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../authContext/useAuth';
import { Button } from '../../Atoms/Button';



export interface MainTemplateProps {
  children: React.ReactNode;
  withHeader?: boolean;
}

const MainTemplate = (props: MainTemplateProps) => {
  const auth = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const handleLinkClick = () => {
    setIsNavOpen(false);
  };

  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isNavOpen]);

  const onLoginClick = useCallback(() => {
    const url = `${location.origin}/login`;
    window.open(url, 'popup', 'toolbar=0,status=0,width=626,height=636');
  }, []);

  return (
    <>
      {props.withHeader && (
        <S.HeaderContainer>
          <S.Header>
            <div>
              <S.HeaderLogo to="/">
                <img height={23} src="/icons/loading.png" alt="" />
                El Pato Clip
              </S.HeaderLogo>

              <S.Links>
                <Link to="/privacy">Privacy</Link>
                <Link to="/tos">ToS</Link>
                <Link
                  target="_blank"
                  to="https://github.com/Niv3K-El-Pato/ElPatoClip"
                >
                Source Code
                </Link>
                <Link target="_blank" to="https://ko-fi.com/niv3k_el_pato">
                Support Me :3
                </Link>
              </S.Links>
            </div>
            <S.Links>

              { auth?.user ? (
                <>
                  <Link to="/account">
                    Account
                  </Link>
                  <Button $variant="outline" onClick={auth.logOut}>Logout</Button>
                </>
              ) : (
                <Button $variant='outline' onClick={onLoginClick}>Login</Button>
              )}
            </S.Links>

            <S.BurgerIcon>
              <button type="button" title="Toggle Menu" onClick={handleNav}>
                <img
                  width={22}
                  src={`/icons/${
                    isNavOpen ? 'MingcuteCloseFill.svg' : 'MingcuteMenuFill.svg'
                  }`}
                  alt={`${isNavOpen ? 'close menu' : 'open menu'}`}
                ></img>
              </button>
            </S.BurgerIcon>
          </S.Header>

          <S.BurgerMenu aria-hidden={!isNavOpen} $isOpen={isNavOpen}>
            <Link 
              tabIndex={!isNavOpen ? -1 : undefined}
              to="/privacy" 
              onClick={handleLinkClick}>
              Privacy
            </Link>
            <Link 
              tabIndex={!isNavOpen ? -1 : undefined}
              to="/tos"
              onClick={handleLinkClick}>
              ToS
            </Link>
            <Link
              tabIndex={!isNavOpen ? -1 : undefined}
              target="_blank"
              to="https://github.com/Niv3K-El-Pato/ElPatoClip"
              onClick={handleLinkClick}
            >
              Source Code
            </Link>
            <Link
              tabIndex={!isNavOpen ? -1 : undefined}
              target="_blank"
              to="https://ko-fi.com/niv3k_el_pato"
              onClick={handleLinkClick}
            >
              Support Me :3
            </Link>
          </S.BurgerMenu>
        </S.HeaderContainer>
      )}

      <S.Container>{props.children}</S.Container>
    </>
  );
};

export default MainTemplate;
