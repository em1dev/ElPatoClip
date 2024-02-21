import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8em; 
  width: 40ch;
  margin: auto;
  gap: 1em;
  > * {
    flex: 1 100%;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-weight: 500;
  }

  input {
    background-color: #272727;
    font-size: 1.1em;
    padding: 0.8em 1em;
    border: none;
    border-radius: 0.5em;
    width:  100%;
  }
`;

export const SearchResultContainer = styled.div`
  display: flex;
  background-color: #272727;
  border-radius: 0.5em;

  > button:not(:last-child) {
    border-bottom: solid 0.2em #343434;
  }
  > div {
    padding: 1em;
  }
`;

export const SearchResultItem = styled(Link)`
  cursor: pointer;
  &:hover {
    background-color: #212121;
  }
  color: inherit;
  text-decoration: none;
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;

  width: 100%;
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.8em 1em;
  img {
    width: 5ch;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    padding: 4px;
    border: solid 2px #D9D9D9;
  }
`;