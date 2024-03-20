import styled, { css } from 'styled-components';


export const Button = styled.button<{
  theme: 'light' | 'dark'
}>`
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 0.2em;
  font-weight: 500;
  font-size: inherit;
  font-family: inherit;
  padding: 0.2em 0.5em;

  &:focus-within {
    outline-offset: 2px;
    outline: 2px solid white;
  }

  ${props => props.theme === 'light' && css`
    background-color: #FFEB39;
    color: #4A4A4A;
    &:hover {
      background-color: #ffef63;
    }
  `}

  ${props => props.theme === 'dark' && css`
    background-color: transparent;
    box-shadow: inset 0 0 0 1px #d9d9d9;
    color: #D9D9D9;
    &:hover {
      background-color: #000000;
    }
  `}
`;