import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #151515;
  display: flex;
  gap: 1em;
  flex-direction: column;
  padding: 1.5em;
  border-radius: 1.3em;
`;

export const VideoContainer = styled.div`
  flex: 1 100%;
  margin: auto;
  height: calc(100% - 90px);
  video {
    aspect-ratio: 1080 / 1920;
    border: none;
    border-radius: 1em;
    max-height: 100%;
    height: 100%;
  }`;

export const LogContainer = styled.div`
  padding: 0.5em;
  border-radius: 0.8em;
  height: 100%;
  width: 100%;
  background-color: #D9D9D9;
  color: #141414;
  white-space: pre-line;
  overflow: auto;
`;
