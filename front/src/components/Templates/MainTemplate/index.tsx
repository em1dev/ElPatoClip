import { Link } from "react-router-dom";
import * as S from "./styles";
import { useState } from "react";

export interface MainTemplateProps {
  children: React.ReactNode;
  withHeader?: boolean;
}

const MainTemplate = (props: MainTemplateProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const handleLinkClick = () => {
    setIsNavOpen(false);
  };

  return (
    <>
      {props.withHeader && (
        <S.HeaderContainer>
          <S.Header>
            <div>
              <S.HeaderLogo to="/">
                <img height={23} src="/icons/loading.png" alt="el pato clip" />
                El Pato Clip
              </S.HeaderLogo>
            </div>
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

            <S.BurgerIcon>
              <button onClick={handleNav}>
                {isNavOpen ? (
                  <>
                    <img width={20} src="/icons/MingcuteCloseFill.svg"></img>
                  </>
                ) : (
                  <img width={20} src="/icons/MingcuteMenuFill.svg"></img>
                )}
              </button>
            </S.BurgerIcon>
          </S.Header>

          {isNavOpen && (
            <S.BurgerMenu>
              <Link to="/privacy" onClick={handleLinkClick}>
                Privacy
              </Link>
              <Link to="/tos" onClick={handleLinkClick}>
                ToS
              </Link>
              <Link
                target="_blank"
                to="https://github.com/Niv3K-El-Pato/ElPatoClip"
                onClick={handleLinkClick}
              >
                Source Code
              </Link>
              <Link
                target="_blank"
                to="https://ko-fi.com/niv3k_el_pato"
                onClick={handleLinkClick}
              >
                Support Me :3
              </Link>
            </S.BurgerMenu>
          )}
        </S.HeaderContainer>
      )}

      <S.Container>{props.children}</S.Container>
    </>
  );
};

export default MainTemplate;
