import styled from "styled-components";

export const Container = styled.div`
  padding-top: 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 100vh;
  gap: 1em;

  video, canvas {
    height: 100%;
    width: 100%;
  }
`;

export const VideoContainer = styled.div`
  max-height: calc(100vh - 13em);
  aspect-ratio: 9/16;
  flex: 1 100%;
`;