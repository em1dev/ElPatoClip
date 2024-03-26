import { styled } from 'styled-components';

export const Container = styled.div`
  cursor: pointer;
  background-color: #FFEB39;
  display: flex;
  align-items: center;
  height: 100%;
  width: 2em;
  justify-content: flex-start;
  padding: 0.5em;
  div + & {
    justify-content: flex-end;
  }
  &:before {
    content: '';
    height: 1em;
    border-radius: 0.3em;
    width: 0.25em;
    background-color: #1A1A1A;
    transform: scale(1);
    transition: transform 0.1s ease-in-out;
  }
  &:hover:before {
    transform: scale(1.3);
  }
`;