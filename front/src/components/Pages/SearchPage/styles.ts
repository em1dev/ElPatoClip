import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  > * {
    font-size: 1.2em;
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
    font-size: 2em;
    margin: 0;
  }

  h2 {
    font-weight: 500;
    font-size: 2em;
  }

  input {
    background-color: #272727;
    font-size: 1.1em;
    padding: 0.8em 1em;
    border: none;
    border-radius: 0.5em;
    width:  100%;
  }

  i {
    color: #FFF973;
  }

  section {
    margin-bottom: 5em;

    @media (max-width: 768px) {
      margin-bottom: 3em;
    }
  }
`;

export const Anchor = styled.a`
  color: #FFF973;
  &:hover {
    text-underline-offset: 0.4em;
    text-decoration: underline;
  }
`;

export const SearchSection = styled.section`
  padding-top: 7em;
  @media (max-width: 768px) {
    padding-top: 3em;
  }
  flex: 1 100%;
  min-height: 100%;
  display: flex;
  flex-direction: row;
  margin: auto;
  gap: 1em;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  > * {
    margin: auto;
  }
  > img {
    width: calc(min(700px, 100%));
  }
`;

export const AboutMeSection = styled.section`
  img {
    border-radius: 50%;
  }
  h2 {
    text-align: center;
  }
  margin: auto;
`;

export const AboutSectionContent = styled.div`
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2em;
  max-width: 800px;
  margin-top: -1em;

  > div:first-child {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    > * {
      margin: 0;
    }
    gap: 0.5em;
  }

  > div:last-child {
    flex: 1;
    min-width: calc(min(430px, 100%)) ;
  }
`;

export const CenterSection = styled.section`
  h2 {
    text-align: center;
  }
  p {
    margin-bottom: 2em;
  }
  max-width: 800px;
  margin: auto;
`;

export const SearchResultContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #272727;
  border-radius: 0.5em;
  margin-top: 1em;

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
  border-radius: 0.5em;
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

export const ClipSearchResultItem = styled(Link)`
  cursor: pointer;
  &:hover {
    background-color: #212121;
  }
  border-radius: 0.5em;
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
    height: 5em;
    border-radius: 0.3em;
    padding: 4px;
    border: solid 2px #D9D9D9;
  }
  div {
    display: flex;
    flex-direction: column;
  }

  div > :last-child {
    font-size: 0.8em;
  }
`;

export const RecentItemsContainer = styled.div`
  margin-top: 0.8em;
`;