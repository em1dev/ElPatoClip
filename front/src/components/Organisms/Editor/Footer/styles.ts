import { styled } from 'styled-components';

export const CurrentTime = styled.span`
  display: inline-block;
  width: 7ch;
`;

export const TotalDuration = styled.span`
  display: inline-block;
  width: 11ch;
  color: #a1a1a1;
`;

export const Container = styled.div`
  padding: 3em;
  > div:first-child {
    margin: auto;
    max-width: 800px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  > div:last-child {
    overflow: auto;
  }
`;

export const TimelineContainer = styled.div`
  display: flex;
  overflow: auto;
  width: 100%;
  > div {
    margin: auto;
    max-width: 100%;
  }
`;

export const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
`;