import styled, { css } from 'styled-components';


type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'white';

export const Button = styled.button<{
  $variant?: ButtonVariant
}>`
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 0.5em;
  font-weight: 500;
  font-size: inherit;
  font-family: inherit;
  padding: 0.5em 0.8em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-within {
    outline-offset: 2px;
    outline: 2px solid white;
  }

  ${props => (!props.$variant || props.$variant === 'primary') ? css`
    background-color: #EAED5D;
    color: #141414;
    &:disabled {
      background-color: #aaac4c;
    }

    &:hover:not(:disabled) {
      background-color: #eef135;
    }
  ` : null}

  ${props => props.$variant === 'secondary' && css`
    background-color: #282828;
    box-shadow: inset 0 0 0 2px #3B3B3B;
    color: #D9D9D9;
    &:disabled {
      color: #afafaf;
    }

    &:hover:not(:disabled) {
      background-color: #1e1e1e;
    }
  `}

  ${props => props.$variant === 'outline' && css`
    background-color: transparent;
    box-shadow: inset 0 0 0 2px #d9d9d9;
    color: #D9D9D9;
    &:hover:not(:disabled) {
      background-color: #000000;
    }
  `}

  ${props => props.$variant === 'white' && css`
    background-color: #D7D7D7;
    color: #141414;

    &:disabled {
      background-color: #818181;
    }

    &:hover:not(:disabled) {
      background-color: #bdbdbd;
    }
  `}
`;