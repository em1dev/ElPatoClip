import styled, { createGlobalStyle } from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  > :first-child {
    width: 100%;
    height: 3em;
    padding: 2em;
    border-bottom: 2px solid #494949;
  }
`;

export const InnerContainer = styled.div`
  display: flex;
  max-width: 100%;
  flex: 1 100%;
  > :first-child {
    flex: 1;
  }
`;

export const CanvasContainer = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  > :first-child {
    flex: 1 100%;
  }
`;

export const GlobalStyles = createGlobalStyle`
  html, body, #root {

  }
  main {
  }
`;