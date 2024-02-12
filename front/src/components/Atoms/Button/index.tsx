import styled, { css } from 'styled-components';


export const Button = styled.button<{
  theme: 'light' | 'dark'
}>`
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 0.2em;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  padding: 0.2em 0.5em;

  ${props => props.theme === 'light' && css`
    background-color: #FFEB39;
    color: #4A4A4A;
    &:hover {
      background-color: #ffef63;
    }
  `}

  ${props => props.theme === 'dark' && css`
    background-color: #4A4A4A;
    color: #D9D9D9;
    &:hover {
      background-color: #4d4d4d;
    }
  `}
`;