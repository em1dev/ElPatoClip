import { RefObject, useCallback } from 'react';
import { useEventListener } from '../../../../../hooks/useEventListener';
import { Layer, Point } from '../../../../../types';
import { CanvasUtils } from '../util/canvasUtils';
import { MathUtils } from '../../../../../Utils/MathUtils';
import { useEditorState } from '../../../../../store/EditorState/useEditorState';

export const useCanvasHover = (
  layers: Array<Layer>,
  canvasRef: RefObject<HTMLCanvasElement>,
  padding: number,
  disableHover: boolean
) => {
  const setHoveredLayer = useEditorState((state) => state.setHoveredLayer);

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mouseleave', useCallback(() => {
    setHoveredLayer(null);
  }, [setHoveredLayer]));

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mousemove', useCallback((e) => {
    if (disableHover) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point: Point = { x: e.offsetX, y: e.offsetY };
    const canvasPoint = CanvasUtils.relativePointToCanvasPoint(point, canvas);
    const canvasPointWithOffset = { x: canvasPoint.x - padding, y: canvasPoint.y - padding};
    for (const layer of layers) {
      if (layer.locked) continue;
      const isInside = MathUtils.isInsideRect(canvasPointWithOffset, layer.output.rect);
      if (!isInside) continue;
      setHoveredLayer(layer.id);
      return;
    }
    setHoveredLayer(null);
  }, [layers, setHoveredLayer, canvasRef, padding, disableHover]));
};