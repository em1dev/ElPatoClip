import { styled } from 'styled-components';

export const Container = styled.div`
  max-height: calc(100vh - 400px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CanvasContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  canvas {
    position: absolute;
    background-color: transparent;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
`;
export const Portrait = styled(CanvasContainer)`
  height: 100%;
  aspect-ratio: 9/16;
`;

export const Landscape = styled(CanvasContainer)`
  aspect-ratio: 16/9;
`;
