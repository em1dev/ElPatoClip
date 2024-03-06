import { MathUtils } from "../../../../../Utils/MathUtils";
import { LayerFilter, LayerShape, Point, Rect, Source } from "../../../../../types";
import { CANVAS_PADDING, RESIZE_HANLDER_RADIUS } from "../settings";

/**
 * Includes padding
 */
const renderCropArea = (ctx: CanvasRenderingContext2D, rect: Rect, color: string, withResizers: boolean) => {
  const x = rect.x + CANVAS_PADDING;
  const y = rect.y + CANVAS_PADDING;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.strokeRect(x, y, rect.width, rect.height);

  if (!withResizers) return;

  ctx.beginPath();
  ctx.arc(x, y, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y + rect.height, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + rect.width, y, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + rect.width, y + rect.height, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

const drawImageFromSource = (
  ctx: CanvasRenderingContext2D, 
  source: CanvasImageSource,
  input: Source,
  output: Source,
  filter: LayerFilter,
  shape: LayerShape,
  padding: number) => {

  ctx.save();
  const { height, width } = MathUtils.calcualtedInputAspectRatioBasednOutput(input.rect, output.rect);
  const x = output.rect.x + padding;
  const y = output.rect.y + padding;

  switch (filter) {
    case 'blur':
      ctx.filter = 'blur(15px)';
      break;
    case 'none':
      ctx.filter = 'none';
      break;
  }

  switch (shape) {
    case 'rectangle':
      ctx.beginPath();
      ctx.rect(x, y, output.rect.width, output.rect.height);
      ctx.clip();
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(
        (x + output.rect.width / 2) , 
        (y + output.rect.height / 2)  ,
        Math.min(output.rect.width, output.rect.height) / 2,
        0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      break;
    case 'round-rectangle':
      ctx.beginPath();
      ctx.roundRect(
        x,
        y,
        output.rect.width,
        output.rect.height,
        25);
      ctx.closePath();
      ctx.clip();
  }

  ctx.drawImage(
    source,
    input.rect.x,
    input.rect.y,
    width,
    height,
    x,
    y,
    output.rect.width,
    output.rect.height,
  );
  ctx.restore();
}

const relativePointToCanvasPoint = (point: Point, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (point.x * canvas.width / rect.width),
    y: (point.y * canvas.height / rect.height) 
  } satisfies Point
};

const clipRect = (ctx: CanvasRenderingContext2D, rect: Rect, radius: number) => {
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, radius);
  ctx.closePath();
  ctx.clip();
}

export const CanvasUtils = {
  drawImageFromSource,
  renderCropArea,
  relativePointToCanvasPoint,
  clipRect
}