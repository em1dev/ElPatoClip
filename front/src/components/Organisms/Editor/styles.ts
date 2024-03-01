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

export const Container = styled.div`
  align-items: center;
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
    // settings
  }
`
export const SideBySideContainer = styled.div`
  align-items: center;
  overflow: hidden;

  margin-top: 2em;
  height: calc(100vh - 15em);
  max-width: 100%;
  max-height: 100%;

  display: flex;
  gap: 1em;

  > :first-child {
    // potrait container
    aspect-ratio: 9 / 16;
    height: 100%;
  }

  > :last-child {
    justify-content: center;
    width: 100%;
    height: 100%;
    // landscape container
  }
`

export const PotraitVideo = styled.div`
  display: flex;
  height: 100%;
  //width: 100%;
  > * {
    width: 100%;
    height: 100%;
    flex: 1 100%;
  }
  //aspect-ratio: 9/16;
  //min-height: 100%;
  //width: 100%;
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