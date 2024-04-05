import { styled } from 'styled-components';

export const ConnectButton = styled.button`
  text-align: center;
  font-size: inherit;
  font-family: inherit;
  width: 100%;
  outline: solid 2px #3C3C3C;
  border: none;
  border-radius: 8px;
  padding: 1em 2em;
  background-color: #282828;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 0.5em;
  cursor: pointer;
  &:hover {
    background-color: #1d1d1d;
  }
`;

export const ExistingConnectionContainer = styled.div`
  gap: 0.5em;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
justify-content: center;

  button {
    width: auto;
    padding: 0.5em 1em;
  }

  > img {
    border-radius: 100%;
  }
  > div {
    margin-right: auto;
    gap: 0.5em;
    flex-direction: column;
    display: flex;
    justify-content: center;
    > div {
      display: flex;
      align-items: center;
      gap: 0.3em;
    }
  }
`;