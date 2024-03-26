import useResizeObserver from '@react-hook/resize-observer';
import { RefObject, useEffect, useState } from 'react';
import { CANVAS_PADDING, VIDEO_RESOLUTIONS, VideoDirection } from '../settings';
import { Size } from '../../../../../types';

export interface CanvasMetadata {
  padding: number,
  scalingFactor: number,
  videoResolution: Size,
  canvasResolution: Size
}

export const useCanvasMetadata = (
  canvasRef: RefObject<HTMLCanvasElement>,
  withPadding: boolean = false,
  videoDirection: VideoDirection) => {
  
  const [canvasMetadata, setCanvasMetadata] = useState<CanvasMetadata>({ 
    padding: 0,
    scalingFactor: 1,
    videoResolution: VIDEO_RESOLUTIONS[videoDirection],
    canvasResolution: VIDEO_RESOLUTIONS[videoDirection]
  });

  useEffect(() => {
    setCanvasMetadata(prev => ({
      ...prev,
      canvasSize: VIDEO_RESOLUTIONS[videoDirection]
    }));
  }, [videoDirection]);


  useResizeObserver(canvasRef, (entry) => {
    if (!withPadding) return;

    const { videoResolution } = canvasMetadata;
    const scalingFactor = videoResolution.width / entry.contentRect.width;
    const canvasResolution: Size = {
      width: videoResolution.width,
      height: videoResolution.height
    };

    canvasResolution.width += (CANVAS_PADDING * 2) * scalingFactor;
    canvasResolution.height += (CANVAS_PADDING * 2) * scalingFactor;
    
    setCanvasMetadata(prev => ({
      ...prev,
      canvasResolution,
      scalingFactor: scalingFactor,
      padding: CANVAS_PADDING * scalingFactor,
    }));
  });

  return canvasMetadata;
};