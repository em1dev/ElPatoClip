import styled, { createGlobalStyle } from "styled-components";

export const ModalOverlay = styled.div`
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  > div {
    max-width: 80%;
    max-height: 80%;
  }
`;

export const VideoContainer = styled.div`
  align-content: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  position: absolute;
  top: 3em;
  left: 1.5em;
  min-height: calc(100vh - 6em);
  max-height: calc(100vh - 5em);

  min-width: calc(100vw - 3em);
  max-width: calc(100vw - 3em);
  overflow: hidden;

  gap: 1em;

  > :last-child {
    align-self: flex-start;
  }

  > :first-child {
    align-self: flex-end;
    // double canvas
    overflow: auto;
    width: calc(100% - 300px);

    max-width: 1200px;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;

    > :first-child {
      // landscape container
      width: calc(((100% - 1em) / 25) * 17);
    }

    > :last-child {
      // potrait video
      width: 100%;

      aspect-ratio: 9/16;
      height: 100%;
      width: 100%;
    }
  }
`

export const LandscapeVideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1em;
  > :nth-child(2) {
    // canvas container
    aspect-ratio: 16/9;
  }
`;

export const TimelineContainer = styled.div`
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GlobalStyles = createGlobalStyle`
  html, body, #root {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex: 1 100%;
    margin: 0;
    padding: 0;
  }
  main {
    display: flex;
    flex: 1 100%;
  }
`;