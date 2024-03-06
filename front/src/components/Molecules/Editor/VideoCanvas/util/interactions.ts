import { MathUtils } from "../../../../../Utils/MathUtils";
import { Layer, Point, Rect } from "../../../../../types";
import { CANVAS_PADDING, RESIZE_HANLDER_RADIUS } from "../settings";

const layerClicked = (layers: Array<Layer>, point: Point) => {
  const layer = layers
    .filter(layer => !layer.locked)
    .reduce((prevLayer, layer) => {
      const layerRectWithOffsett: Rect = {
        ...layer.output.rect,
        x: layer.output.rect.x + CANVAS_PADDING,
        y: layer.output.rect.y + CANVAS_PADDING
      };
      const clickedOnLayer = MathUtils.isInsideRect(point, layerRectWithOffsett);
      if (!clickedOnLayer) return prevLayer;
      if (prevLayer === null) return layer;
      if (layer.zIndex < prevLayer.zIndex) return prevLayer;
      return layer;
    }, null as Layer | null);

  return layer;
}

const isPointOnResizeHandler = (layers: Array<Layer>, point: Point) => {
  let topClickedLayer: Layer | undefined;
  let cornerClicked: string | undefined;

  for (const layer of layers) {
      if (layer.locked) continue;
      const layerPositionOffsetted: Rect = {
        ...layer.output.rect,
        x: layer.output.rect.x + CANVAS_PADDING,
        y: layer.output.rect.y + CANVAS_PADDING
      }

      const cornerBit = MathUtils.getNearestCorner(point, layerPositionOffsetted, RESIZE_HANLDER_RADIUS);
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

export const Interactions = {
  isPointOnResizeHandler,
  layerClicked
}