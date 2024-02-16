import { css, styled } from "styled-components";

export const Seeker = styled.div<{ withAnimation: boolean }>`
  ${({ withAnimation }) => withAnimation && css`
    transition: left 0.3s ease-in-out;
  `}

  bottom: 10px;
  left: 5em;
  position: absolute;
  cursor: pointer;
  border-radius: 3px;
  width: 3px;
  background-color: white;
  height: 80%;

  &:before {
    position: relative;
    left: -6px;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    background-color: white;
    display: block;
    content: '';
    transform: scale(1);
    transition: transform 0.2s ease-in-out;
  }
  &:hover:before {
    transform: scale(1.5);
  }
`;