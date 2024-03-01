import { useRef, MutableRefObject, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as S from './styles';
import { Layer, Point, Source } from '../../../../types';
import { MathUtils } from '../../../../Utils/MathUtils';
import { useRenderLoop } from '../../../../hooks/useRenderLoop';
import { useEventListener } from '../../../../hooks/useEventListener';
import { CanvasUtils, RESIZE_HANLDER_RADIUS } from './canvasUtils';

const checkIfIsResize = (layers: Array<Layer>, clicked: Point) => {
  let topClickedLayer: Layer | undefined;
  let cornerClicked: string | undefined;

  for (const layer of layers) {
      if (layer.locked) continue;
      const cornerBit = MathUtils.getNearestCorner(clicked, layer.output.rect, RESIZE_HANLDER_RADIUS);
      if (cornerBit === null) continue;
      if (!topClickedLayer) {
        cornerClicked = cornerBit;
        topClickedLayer = layer;
        continue;
      }
      if (layer.zIndex < topClickedLayer.zIndex) continue;
      topClickedLayer = layer;
      cornerClicked = cornerBit;
  }

  if (!topClickedLayer) return;

  return {
    layer: topClickedLayer,
    cornerBit: cornerClicked
  }
}

export interface VideoCanvasProp {
  videoRef: MutableRefObject<CanvasImageSource | null>,
  videoResolution?: { width: number, height: number },
  layers: Array<Layer>,
  onOutputChange?: (layerId: number, output: Source) => void,
  toggleVideoPlayback: () => void,
  renderVideo?: boolean
}

export const VideoCanvas = forwardRef<HTMLCanvasElement | null, VideoCanvasProp>(({
  onOutputChange,
  layers,
  videoRef,
  videoResolution = { width: 1920, height: 1080},
  toggleVideoPlayback,
  renderVideo
}, externalRef) => {
  const [interacted, setInteracted] = useState<{
    clickedCorner?: string,
    interactionMode: 'drag' | 'resize',
    clickedOffsetToOrigin?: Point,
    layerId: number
  } | null>(null);

  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(externalRef, () => {
    return canvasRef.current
  });

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mousedown', (e) => {
    if (!onOutputChange) return;
    setHasMoved(false);
    const canvas = canvasRef.current;
    if (!videoRef.current) return;
    if (!canvas) return;
    const offsetClick = { x: e.offsetX, y: e.offsetY };
    const clicked = MathUtils.convertToCanvasPoint(videoResolution, offsetClick, canvas);

    const hasClickedOnResize = checkIfIsResize(layers, clicked);

    if (hasClickedOnResize) {
      setInteracted({
        clickedCorner: hasClickedOnResize.cornerBit,
        layerId: hasClickedOnResize.layer.id,
        interactionMode: 'resize',
      });
      return;
    }

    const layer = layers
      .filter(layer => !layer.locked)
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
      layerId: layer.id,
      interactionMode: 'drag',
    });
  });

  useEventListener<Window, MouseEvent>(window, 'mousemove', (e) => {
    if (!onOutputChange) return;
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

    if (interacted.interactionMode === 'drag') {
      // drag
      if (!interacted.clickedOffsetToOrigin) return;

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
      return;
    }

    if (!interacted.clickedCorner) return;

    const [xBit, yBit] = interacted.clickedCorner.split('');
    const MIN_CROP_SIZE = 100;

    if (yBit === '0' && mouseAtPositionOnCanvas.y > 0) {
      const distanceMoved = layer.output.rect.y - mouseAtPositionOnCanvas.y;
      const newHeight = Math.max(currentPosition.height + distanceMoved, MIN_CROP_SIZE);
      const newDistanceMoved = currentPosition.height - newHeight;

      currentPosition.y = layer.output.rect.y + newDistanceMoved;
      currentPosition.height -= newDistanceMoved;
    }

    if (xBit === '1' && mouseAtPositionOnCanvas.x < videoResolution.width) {
      currentPosition.width = Math.max(mouseAtPositionOnCanvas.x - currentPosition.x, MIN_CROP_SIZE);
    }

    if (yBit === '1' && mouseAtPositionOnCanvas.y < videoResolution.height) {
      currentPosition.height = Math.max(mouseAtPositionOnCanvas.y - currentPosition.y, MIN_CROP_SIZE);
    }

    if (xBit === '0' && mouseAtPositionOnCanvas.x > 0) {
      const distanceMoved = layer.output.rect.x - mouseAtPositionOnCanvas.x;
      const newWidth = Math.max(currentPosition.width + distanceMoved, MIN_CROP_SIZE);
      const newDistanceMoved = currentPosition.width - newWidth;

      currentPosition.x = layer.output.rect.x + newDistanceMoved;
      currentPosition.width -= newDistanceMoved;
    }

    onOutputChange(layer.id, { rect: {
      x: currentPosition.x,
      y: currentPosition.y,
      height: currentPosition.height,
      width: currentPosition.width
    }});
  })

  useEventListener(window, 'mouseup', () => {
    if (!onOutputChange) return;
    setHasMoved(false);
    setInteracted(null);
    if (hasMoved) return;
    toggleVideoPlayback();
  });

  useRenderLoop(useCallback(() => {
      const ctx = canvasRef.current?.getContext('2d');
      const videoEl = videoRef.current;

      if (
        !ctx ||
        !canvasRef.current ||
        !videoEl
        ) return;
      ctx.reset();
      ctx.save();

      const layersSorted = layers.sort((a, b) => a.zIndex - b.zIndex);
      if (renderVideo) {
        ctx.drawImage(videoEl, 0,0, videoResolution.width,  videoResolution.height);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0,0, videoResolution.width, videoResolution.height);
        ctx.restore();
        ctx.save();

        for (const { output, borderColor, locked, filter, shape } of layersSorted) {
          if (locked) continue;
          CanvasUtils.drawImageFromSource(ctx, videoEl, output, output, filter, shape);
          CanvasUtils.renderCropArea(ctx, output.rect, borderColor);
        }
        return;
      }

      for (const { output, input, borderColor, locked, filter, shape } of layersSorted) {
        if (!input) return;
        CanvasUtils.drawImageFromSource(ctx, videoEl, input, output, filter, shape);
        if (locked) continue;
        CanvasUtils.renderCropArea(ctx, output.rect, borderColor);
      }
      ctx.restore();
  }, [layers, renderVideo, videoRef, videoResolution]));

  return (
    <S.CanvasContainer>
      <canvas 
        ref={canvasRef} 
        width={videoResolution.width}
        height={videoResolution.height}
      />
    </S.CanvasContainer>
  )
})