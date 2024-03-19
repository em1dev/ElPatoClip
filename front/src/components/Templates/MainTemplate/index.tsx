import { Link } from "react-router-dom";
import * as S from "./styles";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

export interface MainTemplateProps {
  children: React.ReactNode;
  withHeader?: boolean;
}

const MainTemplate = (props: MainTemplateProps) => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };
  const handleLinkClick = () => {
    setNav(false);
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
              <div onClick={handleNav}>
                {nav ? (
                  <>
                    <AiOutlineClose size={20} />
                  </>
                ) : (
                  <AiOutlineMenu size={20} />
                )}
              </div>
            </S.BurgerIcon>
          </S.Header>

          {nav && (
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
