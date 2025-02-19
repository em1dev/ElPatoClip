import { RefObject, useCallback, useState } from 'react';
import { Layer, Point, Rect, Size, Source } from '../../../../../types';
import { useEventListener } from '../../../../../hooks/useEventListener';
import { CanvasUtils } from '../util/canvasUtils';
import { MIN_CROP_SIZE } from '../settings';
import { MathUtils } from '../../../../../Utils/MathUtils';
import { Interactions } from '../util/interactions';
import { useEditorState } from '../../../../../store/EditorState/useEditorState';

const getNewDraggedPosition = (
  currentPosition: Rect,
  mouseAtPositionOnCanvas: Point,
  interacted: Interaction,
  videoResolution: Size,
  padding: number
) => {
  if (!interacted?.clickedOffsetToOrigin) throw new Error('missing interaction');

  const draggedWithOffset = {
    x: mouseAtPositionOnCanvas.x - interacted.clickedOffsetToOrigin.x,
    y: mouseAtPositionOnCanvas.y - interacted.clickedOffsetToOrigin.y
  };

  const newPosition: Rect = {
    ...currentPosition,
    x: Math.round(draggedWithOffset.x - padding),
    y: Math.round(draggedWithOffset.y - padding)
  };

  newPosition.x = MathUtils.clamp(newPosition.x, 0, videoResolution.width - newPosition.width);
  newPosition.y = MathUtils.clamp(newPosition.y, 0, videoResolution.height - newPosition.height);
  return newPosition;
};

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
  padding: number,
  scalingFactor: number,
  onOutputChange?: (layerId: number, output: Source) => void
) => {
  const setHoveredLayer = useEditorState(state => state.setHoveredLayer);
  const setSelectedLayer = useEditorState(state => state.setSelectedLayer);
  const selectedLayerId = useEditorState((state) => state.selectedLayer?.id);
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

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
      const hasClickedOnResize = Interactions.isPointOnResizeHandler([selectedLayer], clicked, padding, scalingFactor);
      if (hasClickedOnResize) {
        setInteracted({
          clickedCorner: hasClickedOnResize.cornerBit,
          layerId: hasClickedOnResize.layer.id,
          interactionMode: 'resize',
        });
        return;
      }
    }

    const layer = Interactions.layerClicked(layers, clicked, padding);
    setHoveredLayer(null);
    setSelectedLayer(layer?.id ?? null);

    if (!layer) return;

    const offsetClicked = {
      x: (clicked.x - (layer.output.rect.x + padding)),
      y: (clicked.y - (layer.output.rect.y + padding))
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
    const mouse = MathUtils.subPosition(mouseAtPositionOnCanvas, { x: padding, y: padding });

    if (!interacted?.clickedCorner) return;

    const newPosition: Rect = { x, y, height, width };
    const [xBit, yBit] = interacted.clickedCorner.split('');

    if (yBit === '0' && y >= 0) {
      // top
      const distanceMoved = Math.round(y - mouse.y);
      const newHeight = Math.max(height + distanceMoved, MIN_CROP_SIZE);
      const newDistanceMoved = height - newHeight;

      newPosition.y = Math.max(y + newDistanceMoved, 0);
      newPosition.height -= (newPosition.y - y);
    }

    if (yBit === '1') {
      // bottom
      const distanceMoved = Math.round(mouse.y - newPosition.y);
      newPosition.height = Math.max(distanceMoved, MIN_CROP_SIZE);
      const bot = Math.min(newPosition.y + newPosition.height, videoResolution.height);
      newPosition.height = bot - newPosition.y;
    }

    if (xBit === '0') {
      // left
      const distanceMoved = Math.round(x - mouse.x);
      const newWidth = Math.max(width + distanceMoved, MIN_CROP_SIZE);
      const newDistanceMoved = width - newWidth;

      newPosition.x = Math.max(x + newDistanceMoved, 0);
      newPosition.width -= (newPosition.x - x);
    }

    if (xBit === '1') {
      // right
      const distanceMoved = Math.round(mouse.x - newPosition.x);
      newPosition.width = Math.max(distanceMoved, MIN_CROP_SIZE);
      const top = Math.min(newPosition.x + newPosition.width, videoResolution.width);
      newPosition.width = top - newPosition.x;
    }

    onOutputChange && onOutputChange(id, { rect: newPosition });
  }, [onOutputChange, interacted, videoResolution, padding]);

  const handleDrag = useCallback((currentPosition:Rect, mouseAtPositionOnCanvas: Point, id: number) => {
    if (!interacted || !onOutputChange) return;
    const newPosition = getNewDraggedPosition(currentPosition, mouseAtPositionOnCanvas, interacted, videoResolution, padding) ;
    if (!newPosition) return;
    onOutputChange(id, { rect: newPosition });
  }, [interacted, videoResolution, onOutputChange, padding]);

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
  }, [canvasRef, handleDrag, handleResize, interacted, layers, onOutputChange]));

  useEventListener(window, 'mouseup', useCallback(() => {
    if (!onOutputChange) return;
    setInteracted(null);
  }, [setInteracted, onOutputChange]));

  return interacted;
};