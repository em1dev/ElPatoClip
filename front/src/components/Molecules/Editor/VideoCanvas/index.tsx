import { useRef, MutableRefObject, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import * as S from './styles';
import { Layer, Source } from '../../../../types';
import { useEventListener } from '../../../../hooks/useEventListener';
import { CANVAS_PADDING, VIDEO_RESOLUTIONS, VideoDirection } from './settings';
import { useRender } from './hooks/useRender';
import { useCanvasHover } from './hooks/useCanvasHover';
import { useCanvasDrag } from './hooks/useCanvasDrag';

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

  const videoResolution = useMemo(() => (
    VIDEO_RESOLUTIONS[direction]
  ), [direction]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interacted = useCanvasDrag(
    layersSortedAsc, canvasRef, videoResolution,
    selectedLayer, setSelectedLayerId, setHoverLayerId, onOutputChange);

  const hoveredLayer = useCanvasHover(layersSortedDesc, hoverLayerId, canvasRef, setHoverLayerId);

  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(externalRef, () => {
    return canvasRef.current
  });

  useEventListener<Window, MouseEvent>(window, 'mousedown', useCallback((e) => {
    if (!canvasRef.current) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.type === 'video-canvas') return;
    setHoverLayerId(null);
    setSelectedLayerId(null);
  }, [setHoverLayerId, setSelectedLayerId]));

  useRender(canvasRef, videoRef, videoResolution, selectedLayer, hoveredLayer, layersSortedAsc, !!renderVideo, !!interacted, withPadding);

  return (
    <S.CanvasContainer>
      <canvas 
        data-type='video-canvas'
        ref={canvasRef} 
        width={videoResolution.width + (withPadding ? (CANVAS_PADDING * 2) : 0)}
        height={videoResolution.height + (withPadding ? (CANVAS_PADDING * 2) : 0)}
      />
    </S.CanvasContainer>
  )
})