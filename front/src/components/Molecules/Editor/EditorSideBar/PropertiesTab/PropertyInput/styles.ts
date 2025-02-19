import { styled } from 'styled-components';

export const InputContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5em;

  padding: 0.5em 0.8em;
  border-radius: 0.4em;
  background-color: #272727;

  position: relative;
  width: 8ch;

  input {
    color: white;
    &:disabled {
      color: #888888;
    }
    position: absolute;

    padding-left: 2em;
    left: 0;
    width: 100%;
    height: 100%;

    background: none;
    border: none;
    font-size: 1em;
    font-family: inherit;
    outline: none;
  }
  &:focus-within {
    outline: solid 2px #d9d9d9;
  }
`;