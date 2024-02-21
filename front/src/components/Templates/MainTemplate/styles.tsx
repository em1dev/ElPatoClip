import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.main`
  margin: 1em;
  margin-top: 2em;
`;

export const Header = styled.header`
  max-width: 90em;
  padding: 0 2em;
  z-index: 2;
  background-color: #1A1A1A;
  position: fixed;
  top: 0;
  width: 100%;
  height: 3em;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

export const Footer = styled.footer`
  border-radius: 1em 1em 0 0;
  padding: 0 1em;
  background-color: #1A1A1A;
  display: flex;
  align-self: center;
  justify-content: center;
  gap: 1em;
  position: fixed;
  bottom: 0;
  z-index: 2;
  height: 4em;
  left: 50%;
  transform: translateX(-50%);
  > a {
    color: #adadad;
    text-decoration: none;
    transition: transform 0.3s ease-in-out;
    transform: translateY(0px);
    padding: 1em 0.2em;
    &:hover {
      color: white;
      transform: translateY(-5px);
    }
  }
`;

export const HeaderLogo = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
`;