import { useRef, MutableRefObject, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Source } from '../../../../types';
import { useEventListener } from '../../../../hooks/useEventListener';
import { VideoDirection } from './settings';
import { useRender } from './hooks/useRender';
import { useCanvasHover } from './hooks/useCanvasHover';
import { useCanvasDrag } from './hooks/useCanvasDrag';
import { useCanvasMetadata } from './hooks/useCanvasMetadata';
import { useEditorState } from '../../../../store/EditorState/useEditorState';

export interface VideoCanvasProp {
  videoRef: MutableRefObject<CanvasImageSource | null>,
  direction?: VideoDirection,
  onOutputChange?: (layerId: number, output: Source) => void,
  renderVideo?: boolean,
  withPadding: boolean,
  type: 'input' | 'output',
  locked?: boolean
}

export const VideoCanvas = forwardRef<HTMLCanvasElement | null, VideoCanvasProp>(({
  onOutputChange,
  videoRef,
  renderVideo,
  direction = 'portrait',
  withPadding,
  type,
  locked = false
}, externalRef) => {
  const layerData = useEditorState(state => state.layers);

  const layers = useMemo(() =>{
    if (type === 'input') {
      return layerData.map((item) => ({
        ...item,
        input: undefined,
        output: item.input!,
        locked: locked || item.locked
      }));
    }

    // output
    return layerData.map((item) => ({
      ...item,
      output: item.output,
      input: item.input,
      locked: locked || item.locked
    }));
  }, [layerData, type, locked]);

  const layersSortedAsc = useMemo(() => ( 
    layers.toSorted((a,b) => (a.zIndex - b.zIndex))
  ), [layers]); 

  const layersSortedDesc = useMemo(() => ( 
    layers.toSorted((a,b) => (b.zIndex - a.zIndex))
  ), [layers]);

  const setHoveredLayer = useEditorState(state => state.setHoveredLayer);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasMetadata = useCanvasMetadata(canvasRef, withPadding, direction);

  const interacted = useCanvasDrag(layersSortedAsc, canvasRef, canvasMetadata.videoResolution, canvasMetadata.padding, canvasMetadata.scalingFactor, onOutputChange);

  useCanvasHover(layersSortedDesc, canvasRef, canvasMetadata.padding, interacted !== null);

  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(externalRef, () => {
    return canvasRef.current;
  });

  useEventListener<Window, MouseEvent>(window, 'mousedown', useCallback((e) => {
    if (!canvasRef.current) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.type === 'video-canvas') return;
    setHoveredLayer(null);
  }, [setHoveredLayer]));

  useRender(layersSortedAsc, canvasRef, videoRef, canvasMetadata, !!renderVideo, !!interacted);

  return (
    <canvas 
      data-type='video-canvas'
      ref={canvasRef} 
      width={canvasMetadata.canvasResolution.width}
      height={canvasMetadata.canvasResolution.height}
    />
  );
});