import { useRef, MutableRefObject, useEffect, useState, useCallback } from 'react';
import * as S from './styles';
import { Layer, Point, Rect, Source } from '../../../types';
import { MathUtils } from '../../../Utils/MathUtils';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { useEventListener } from '../../../hooks/useEventListener';

export interface VideoCanvasProp {
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  videoResolution?: { width: number, height: number },
  layers: Array<Layer>,
  onOutputChange: (layerId: number, output: Source) => void,
  toggleVideoPlayback: () => void,
  renderVideo?: boolean
}

// move to a useCanvas
const renderCropArea = (ctx: CanvasRenderingContext2D, rect: Rect, color: string) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  const radius = 15;
  ctx.beginPath();
  ctx.arc(rect.x, rect.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rect.x, rect.y + rect.height, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rect.x + rect.width, rect.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rect.x + rect.width, rect.y + rect.height, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

export const VideoCanvas = ({
  onOutputChange,
  layers,
  videoRef,
  videoResolution = { width: 1920, height: 1080},
  toggleVideoPlayback,
  renderVideo
}: VideoCanvasProp) => {
 // const [interactiveMode, setInteractionMode] = useState<'edit' | 'drag' | 'resize'>('edit');
  const [interacted, setInteracted] = useState<{
    clickedOffsetToOrigin: Point,
    layerId: number
  } | null>(null);

  const [hasMoved, setHasMoved] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDrawFnRef = useRef<() => void>(() => {});

  // TODO - refactor
  useRenderLoop(useCallback(() => {
    onDrawFnRef.current();
  }, []));

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mousedown', (e) => {
    setHasMoved(false);
    const canvas = canvasRef.current;
    if (!videoRef.current) return;
    if (!canvas) return;
    const offsetClick = { x: e.offsetX, y: e.offsetY };
    const clicked = MathUtils.convertToCanvasPoint(videoResolution, offsetClick, canvas);
    const layer = layers
      .reduce((prevLayer, layer) => {
        const clickedOnLayer = MathUtils.isInsideRect(clicked, layer.output.rect);
        if (!clickedOnLayer) return prevLayer;
        if (prevLayer === null) return layer;
        if (layer.zIndex < prevLayer.zIndex) return prevLayer;
        return layer;
      }, null as Layer | null);

    if (!layer) return;

    const canvasRect = canvas.getBoundingClientRect();
    const relativePoint = MathUtils.convertToCanvasPoint(videoResolution, 
      { x: e.x - canvasRect.left, y: e.y - canvasRect.top },
    canvas);

    const offsetClicked = {
      x: relativePoint.x - layer.output.rect.x,
      y: relativePoint.y - layer.output.rect.y
    };

    setInteracted({
      clickedOffsetToOrigin: offsetClicked,
      layerId: layer.id
    });
  });

  useEventListener<Window, MouseEvent>(window, 'mousemove', (e) => {
    setHasMoved(true);
    if (!canvasRef.current) return;
    if (!interacted) return;
    e.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const layer = layers.find(item => item.id === interacted.layerId);
    if (!layer) return;

    let currentPosition = { ...layer.output.rect };

    const relativeMousePosition = {
      x: e.x - canvasRect.left,
      y: e.y - canvasRect.top
    };

    const mouseAtPositionOnCanvas = MathUtils.convertToCanvasPoint(videoResolution, relativeMousePosition, canvasRef.current);
    mouseAtPositionOnCanvas.x -= interacted.clickedOffsetToOrigin.x;
    mouseAtPositionOnCanvas.y -= interacted.clickedOffsetToOrigin.y;

    currentPosition.x = mouseAtPositionOnCanvas.x;
    currentPosition.y = mouseAtPositionOnCanvas.y;

    currentPosition = {
      ...currentPosition,
      x: MathUtils.clamp(currentPosition.x, 0, videoResolution.width - currentPosition.width),
      y: MathUtils.clamp(currentPosition.y, 0, videoResolution.height - currentPosition.height),
    }

    onOutputChange(layer.id, { rect: currentPosition });
  })

  useEventListener(window, 'mouseup', () => {
    setHasMoved(false);
    setInteracted(null);
    if (hasMoved) return;
    toggleVideoPlayback();
  });

  useEffect(() => {
    onDrawFnRef.current = () => {
      const ctx = canvasRef.current?.getContext('2d');
      const videoEl = videoRef.current;

      if (
        !ctx ||
        !canvasRef.current ||
        !videoEl
        ) return;

      ctx.reset()
      //ctx.clearRect(0,0, videoResolution.width, videoResolution.height);
      //TODO refactor
      if (renderVideo) {
        ctx.drawImage(videoEl, 0,0, videoResolution.width,  videoResolution.height);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0,0, videoResolution.width, videoResolution.height);

        for (const { output, borderColor } of layers) {
          ctx.drawImage(videoEl,
            output.rect.x,
            output.rect.y,
            output.rect.width,
            output.rect.height,
            output.rect.x,
            output.rect.y,
            output.rect.width,
            output.rect.height
          );

          renderCropArea(ctx, output.rect, borderColor);
        }

      } else {
        for (const { output, input, borderColor } of layers) {
          if (!input) return;
          ctx.drawImage(
            videoEl,
            input.rect.x,
            input.rect.y,
            input.rect.width,
            input.rect.height,
            output.rect.x,
            output.rect.y,
            output.rect.width,
            output.rect.height,
          );
          renderCropArea(ctx, output.rect, borderColor);
        }
      }

    };

    return () => {
      onDrawFnRef.current = () => {};
    }

  }, [videoRef, videoResolution, renderVideo, layers]);

  return (
    <S.CanvasContainer>
      <canvas 
        ref={canvasRef} 
        width={videoResolution.width}
        height={videoResolution.height}
      />
    </S.CanvasContainer>
  )
}