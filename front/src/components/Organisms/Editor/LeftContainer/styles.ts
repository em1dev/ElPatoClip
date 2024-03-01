import { styled } from "styled-components";

export const LandscapeVideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  > :nth-child(2) {
    // canvas container
    aspect-ratio: 16/9;
  }
`;

export const TimelineContainer = styled.div`
  min-height: 9em;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

