import styled from 'styled-components';

export const Container = styled.div`
  justify-content: center;
  margin: auto;
  padding-top: 3em;
  display: flex;
  flex-direction: row;
  max-height: 100vh;
  gap: 1em;

  video, canvas {
    height: 100%;
  }
`;

export const VideoContainer = styled.div`
  max-height: calc(100vh - 13em);
  aspect-ratio: 9/16;
`;

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 40em;
`;

export const ExportingLoaderContainer = styled.div`
  background-color: #151515;
  border-radius: 17px;
  padding: 2em;

  font-size: 1.5em;
  font-weight: 500;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10em;
`;