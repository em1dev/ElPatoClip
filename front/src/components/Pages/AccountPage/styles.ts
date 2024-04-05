import styled from 'styled-components';

export const Card = styled.section`
  margin: auto;
  margin-top: 10em;
  max-width: 100%;
  width: 500px;
  background-color: #161616;
  border-radius: 13px;
  padding: 5em 3em;
  padding-bottom: 4em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;

  h1,
  h2 {
    font-weight: 500;
    margin: 0;
  }

  h1 {
    font-size: 2.8em;
  }

  h2 {
    font-size: 2em;
    margin-top: 0.4em;
    line-height: 0.5em
  }

  p {
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-top: 7em;
    padding: 2em 1.2em;
    h1 {
      font-size: 2em;
    }
    h2 {
      font-size: 1.8em;
    }
  }
`;

export const ProfileImage = styled.img`
  border-radius: 100%;
  @media (max-width: 768px) {
    height: 50px
  }
`;

export const ProfileDetails = styled.div`
  width: 100%;
  outline: solid 2px #3C3C3C;
  border-radius: 8px;
  padding: 1em 2em;
  background-color: #282828;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1.5em;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    p {
      margin: 0;
    }
    > div {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
  }

  span {
    font-size: 0.8em;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    padding: 1em;
    cursor: pointer;
    background-color: transparent;
    border: none;
    &:hover {
      border-radius: 100%;
      background-color: #1d1d1d;
    }
  }

  @media (max-width: 768px) {
    padding: 1em;
    img {
      //height: 50px;
      //aspect-ratio: 1/1;
    }
  }
`;

export const ConnectionButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
`;