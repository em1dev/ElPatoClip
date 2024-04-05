import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const CommonLayout = css`
  margin: auto;
  max-width: 100em;
  padding: 0 2em;
  width: 100%;
`;

export const Container = styled.main`
  ${CommonLayout}
  margin-top: 4em;
`;

export const HeaderContainer = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 2;
`;

export const Header = styled.div`
  ${CommonLayout}

  background-color: #1a1a1a;
  height: 5em;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
`;

export const Links = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
  a {
    color: #adadad;
    text-decoration: none;
    padding: 1em 0.2em 0 0.2em;
    text-underline-offset: 0.4em;
    &:hover {
      color: white;
      text-decoration: underline;
    }
  }
  button {
    margin: 1em 0.2em 0 0.2em;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderLogo = styled(Link)`
  padding: 1em 0.2em 0 0.2em;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
`;

export const BurgerIcon = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    button {
      background-color: transparent;
      border: none;
    }
    button:hover {
      cursor: pointer;
    }
  }
`;

export const BurgerMenu = styled.div<{ $isOpen: boolean }>`
  overflow: auto;
  position: absolute;
  height: calc(100vh - 5em);

  transition: transform 0.5s ease-in-out;
  transform: translateX(100vw);

  ${({ $isOpen }) => $isOpen && css`
    transform: translateX(0);
  `}

  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 2em;
  width: 100%;
  padding: 2em;
  a {
    padding: 1.5em;
  }
  @media (min-width: 768px) {
    display: none;
  }
`;
