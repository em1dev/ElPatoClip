import styled from "styled-components";

export const Container = styled.div`
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 8em;
  padding: 0.5em;
  > :first-child {
    z-index: 1;
  }
`;

export const DurationContainer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
`

export const TimelineContainer = styled.div<{ width: number }>`
  border-radius: 0.5em;
  padding: 0.5em;
  margin-left: 7px;
  background-color: #252525;
  width: ${ props => props.width }px;
`

export const LayerContainer = styled.div`
  z-index: 1;
  position: relative;
  overflow: hidden;
  border-radius: 0.3em;
  height: 1.8em;
  display: flex;
`;

export const Layer = styled.div`
  cursor: pointer;
  background-color: #FFEB39;
  flex: 1;
`;

export const Spacer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  min-height: 50px;
  &:before {
    content: ' ';
    border-radius: 100%;
    width: 5px;
    height: 5px;
    background-color: #666666;
  }
`;

export const TimeLabel = styled.div`
  width: 50px;
  max-width: 50px;
  min-width: 50px;
  text-align: center;
  color: #666666;
`;

// Playback
export const PlaybackLineContainer = styled.div<{ width: number }>`
  z-index: 0;
  top: 14px;
  position: relative;
  border-radius: 0.2em;
  padding: 0 0.5em;
  margin-left: 7px;
  background-color: #252525;
  width: ${ props => props.width}px;
`

export const PlaybackLine = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.2em;
  height: 0.3em;
  display: flex;
`;