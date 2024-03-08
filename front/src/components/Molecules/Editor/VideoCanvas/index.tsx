import { useRef, MutableRefObject, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import * as S from './styles';
import { Layer, Source } from '../../../../types';
import { useEventListener } from '../../../../hooks/useEventListener';
import { VideoDirection } from './settings';
import { useRender } from './hooks/useRender';
import { useCanvasHover } from './hooks/useCanvasHover';
import { useCanvasDrag } from './hooks/useCanvasDrag';
import { useCanvasMetadata } from './hooks/useCanvasMetadata';

export interface VideoCanvasProp {
  videoRef: MutableRefObject<CanvasImageSource | null>,
  direction?: VideoDirection,
  layers: Array<Layer>,
  onOutputChange?: (layerId: number, output: Source) => void,
  renderVideo?: boolean
  selectedLayerId: number | null,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<number | null>>
  hoverLayerId: number | null,
  setHoverLayerId: React.Dispatch<React.SetStateAction<number | null>>,
  withPadding: boolean
}

export const VideoCanvas = forwardRef<HTMLCanvasElement | null, VideoCanvasProp>(({
  onOutputChange,
  layers,
  videoRef,
  renderVideo,
  direction = 'portrait',
  hoverLayerId,
  setHoverLayerId,
  selectedLayerId,
  setSelectedLayerId,
  withPadding
}, externalRef) => {
  const layersSortedAsc = useMemo(() => ( 
    layers.toSorted((a,b) => (a.zIndex - b.zIndex))
  ), [layers]); 

  const layersSortedDesc = useMemo(() => ( 
    layers.toSorted((a,b) => (b.zIndex - a.zIndex))
  ), [layers]); 

  const selectedLayer = useMemo(() => (
    layers.find(l => l.id === selectedLayerId)
  ), [selectedLayerId, layers]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasMetadata = useCanvasMetadata(canvasRef, withPadding, direction);

  const interacted = useCanvasDrag(
    layersSortedAsc, canvasRef, canvasMetadata.videoResolution,
    selectedLayer, setSelectedLayerId, setHoverLayerId, canvasMetadata.padding, canvasMetadata.scalingFactor, onOutputChange);

  const hoveredLayer = useCanvasHover(layersSortedDesc, hoverLayerId, canvasRef, setHoverLayerId, canvasMetadata.padding, interacted !== null);

  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(externalRef, () => {
    return canvasRef.current
  });

  useEventListener<Window, MouseEvent>(window, 'mousedown', useCallback((e) => {
    if (!canvasRef.current) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.type === 'video-canvas') return;
    setHoverLayerId(null);
  }, [setHoverLayerId]));

  useRender(
    canvasRef, videoRef, canvasMetadata,
    selectedLayer, hoveredLayer, layersSortedAsc,
    !!renderVideo, !!interacted);

  return (
    <S.CanvasContainer>
      <canvas 
        data-type='video-canvas'
        ref={canvasRef} 
        width={canvasMetadata.canvasResolution.width}
        height={canvasMetadata.canvasResolution.height}
      />
    </S.CanvasContainer>
  )
})