import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1500px;
  margin: 5em auto;
  padding: 1.5em;
`;

export const VideoContainer = styled.div`
  align-items: center;
  margin: auto;
  flex-direction: row;
  display: flex;
  gap: 1em;
`

export const TimelineContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

export const LoadingVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5em;
  align-items: center;
  flex-direction: column;
  gap: 0.5em;
`;

export const Progress = styled.div`
  font-weight: 500;
  font-size: 2em;
`;