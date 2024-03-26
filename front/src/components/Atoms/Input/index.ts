import styled, { css } from 'styled-components';

export const Input = styled.input<{
  size?: 'sm' | 'md'
}>`
  font-size: 1.1em;
  border: none;
  border-radius: 0.5em;
  background-color: #272727;
  color: #d9d9d9;

  &:focus-within {
    outline: 2px solid #D9D9D9;
  }

  padding: 0.8em 1em;
  ${({size}) => size === 'sm' && css`
    padding: 0.5em 0.5em;
    font-size: 1em;
  `}
`;