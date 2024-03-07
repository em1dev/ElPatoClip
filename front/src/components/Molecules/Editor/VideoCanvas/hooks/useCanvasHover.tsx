import { Dispatch, RefObject, SetStateAction, useCallback, useMemo } from "react";
import { useEventListener } from "../../../../../hooks/useEventListener";
import { Layer, Point } from "../../../../../types";
import { CanvasUtils } from "../util/canvasUtils";
import { MathUtils } from "../../../../../Utils/MathUtils";

export const useCanvasHover = (
  layers: Array<Layer>,
  hoverLayerId: number | null,
  canvasRef: RefObject<HTMLCanvasElement>,
  setHoverLayerId: Dispatch<SetStateAction<number | null>>,
  padding: number,
  disableHover: boolean
) => {
  const hoveredLayer = useMemo(() => layers.find(l => l.id === hoverLayerId), [hoverLayerId, layers]);

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mouseleave', useCallback(() => {
    setHoverLayerId(null);
  }, [setHoverLayerId]));

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
      setHoverLayerId(layer.id);
      return;
    }
    setHoverLayerId(null);
  }, [layers, setHoverLayerId, canvasRef, padding, disableHover]));

  return hoveredLayer
}