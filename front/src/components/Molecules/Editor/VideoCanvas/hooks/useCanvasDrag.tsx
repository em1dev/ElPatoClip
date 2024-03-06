import { Dispatch, RefObject, SetStateAction, useCallback, useState } from "react";
import { Layer, Point, Rect, Size, Source } from "../../../../../types";
import { useEventListener } from "../../../../../hooks/useEventListener";
import { CanvasUtils } from "../util/canvasUtils";
import { CANVAS_PADDING, MIN_CROP_SIZE } from "../settings";
import { MathUtils } from "../../../../../Utils/MathUtils";
import { Interactions } from "../util/interactions";

const getNewDraggedPosition = (
  currentPosition: Rect,
  mouseAtPositionOnCanvas: Point,
  interacted: Interaction,
  videoResolution: Size
) => {
  if (!interacted?.clickedOffsetToOrigin) throw new Error('missing interaction');

  const draggedWithOffset = {
    x: mouseAtPositionOnCanvas.x - interacted.clickedOffsetToOrigin.x,
    y: mouseAtPositionOnCanvas.y - interacted.clickedOffsetToOrigin.y
  }

  const newPosition: Rect = {
    ...currentPosition,
    x: draggedWithOffset.x - CANVAS_PADDING,
    y: draggedWithOffset.y - CANVAS_PADDING
  }

  newPosition.x = MathUtils.clamp(newPosition.x, 0, videoResolution.width - newPosition.width);
  newPosition.y = MathUtils.clamp(newPosition.y, 0, videoResolution.height - newPosition.height);
  return newPosition;
}

export interface Interaction {
  clickedCorner?: string,
  interactionMode: 'drag' | 'resize',
  clickedOffsetToOrigin?: Point,
  layerId: number
}

export const useCanvasDrag = (
  layers: Array<Layer>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  videoResolution: Size,
  selectedLayer: Layer | undefined,
  setSelectedLayerId: Dispatch<SetStateAction<number | null>>,
  setHoverLayerId: Dispatch<SetStateAction<number | null>>,
  onOutputChange?: (layerId: number, output: Source) => void,
) => {
  const [interacted, setInteracted] = useState<{
    clickedCorner?: string,
    interactionMode: 'drag' | 'resize',
    clickedOffsetToOrigin?: Point,
    layerId: number
  } | null>(null);

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mousedown', (e) => {
    if (!onOutputChange) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const offsetClick = { x: e.offsetX, y: e.offsetY };

    const clicked = CanvasUtils.relativePointToCanvasPoint(offsetClick, canvas);

    if (selectedLayer) {
      const hasClickedOnResize = Interactions.isPointOnResizeHandler([selectedLayer], clicked);
      if (hasClickedOnResize) {
        setInteracted({
          clickedCorner: hasClickedOnResize.cornerBit,
          layerId: hasClickedOnResize.layer.id,
          interactionMode: 'resize',
        });
        return;
      }
    }

    const layer = Interactions.layerClicked(layers, clicked);
    if (!layer) {
      setSelectedLayerId(null);
      setHoverLayerId(null);
      return;
    }

    setHoverLayerId(null);
    setSelectedLayerId(layer.id);

    const offsetClicked = {
      x: (clicked.x - (layer.output.rect.x + CANVAS_PADDING)),
      y: (clicked.y - (layer.output.rect.y + CANVAS_PADDING))
    };

    setInteracted({
      clickedOffsetToOrigin: offsetClicked,
      layerId: layer.id,
      interactionMode: 'drag',
    });
  });

  const handleResize = useCallback((
    id: number,
    { x, y, height, width }: Rect,
    mouseAtPositionOnCanvas: Point,
  ) => {
    const mouse = MathUtils.subPosition(mouseAtPositionOnCanvas, { x: CANVAS_PADDING, y: CANVAS_PADDING })

    if (!interacted?.clickedCorner) return;

    const newPosition: Rect = { x, y, height, width };
    const [xBit, yBit] = interacted.clickedCorner.split('');

    if (yBit === '0' && y >= 0) {
      // top
      const distanceMoved = y - mouse.y;
      const newHeight = Math.max(height + distanceMoved, MIN_CROP_SIZE);
      const newDistanceMoved = height - newHeight;

      newPosition.y = Math.max(y + newDistanceMoved, 0);
      newPosition.height -= (newPosition.y - y);
    }

    if (yBit === '1') {
      // bottom
      newPosition.height = Math.max(mouse.y - newPosition.y, MIN_CROP_SIZE);
      const bot = Math.min(newPosition.y + newPosition.height, videoResolution.height);
      newPosition.height = bot - newPosition.y;
    }

    if (xBit === '0') {
      // left
      const distanceMoved = x - mouse.x;
      const newWidth = Math.max(width + distanceMoved, MIN_CROP_SIZE);
      const newDistanceMoved = width - newWidth;

      newPosition.x = Math.max(x + newDistanceMoved, 0);
      newPosition.width -= (newPosition.x - x);
    }

    if (xBit === '1') {
      // right
      newPosition.width = Math.max(mouse.x - newPosition.x, MIN_CROP_SIZE);
      const top = Math.min(newPosition.x + newPosition.width, videoResolution.width);
      newPosition.width = top - newPosition.x;
    }

    onOutputChange && onOutputChange(id, { rect: newPosition });
  }, [onOutputChange, interacted, videoResolution]);

  const handleDrag = useCallback((currentPosition:Rect, mouseAtPositionOnCanvas: Point, id: number) => {
    if (!interacted || !onOutputChange) return;
    const newPosition = getNewDraggedPosition(currentPosition, mouseAtPositionOnCanvas, interacted, videoResolution) ;
    if (!newPosition) return;
    onOutputChange(id, { rect: newPosition });
  }, [interacted, videoResolution, onOutputChange]);

  useEventListener<Window, MouseEvent>(window, 'mousemove', useCallback((e) => {
    if (!onOutputChange) return;
    if (!canvasRef.current) return;
    if (!interacted) return;
    e.preventDefault();

    const layer = layers.find(item => item.id === interacted.layerId);
    if (!layer) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentPosition = { ...layer.output.rect };

    const relativeMousePosition = {
      x: e.x - canvasRect.left,
      y: e.y - canvasRect.top
    };

    const mouseAtPositionOnCanvas = CanvasUtils.relativePointToCanvasPoint(relativeMousePosition, canvasRef.current);

    switch (interacted.interactionMode) {
      case 'drag':
        handleDrag(currentPosition, mouseAtPositionOnCanvas, layer.id);
        break;
      case 'resize':
        handleResize(layer.id, currentPosition, mouseAtPositionOnCanvas);
        break;
    }
  }, [canvasRef, handleDrag, handleResize, interacted, layers, onOutputChange]))

  useEventListener(window, 'mouseup', useCallback(() => {
    if (!onOutputChange) return;
    setInteracted(null);
  }, [setInteracted, onOutputChange]));

  return interacted;
};