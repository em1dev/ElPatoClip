import { MathUtils } from "../../../Utils/MathUtils";
import { LayerFilter, Rect, Source } from "../../../types";

export const RESIZE_HANLDER_RADIUS = 15;

const renderCropArea = (ctx: CanvasRenderingContext2D, rect: Rect, color: string) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.beginPath();
  ctx.arc(rect.x, rect.y, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rect.x, rect.y + rect.height, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rect.x + rect.width, rect.y, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(rect.x + rect.width, rect.y + rect.height, RESIZE_HANLDER_RADIUS, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}



const drawImageFromSource = (ctx: CanvasRenderingContext2D, source: CanvasImageSource, input:Source, output: Source, filter: LayerFilter) => {
  const { height, width } = MathUtils.calcualtedInputAspectRatioBasednOutput(input.rect, output.rect);

  switch (filter) {
    case 'blur':
      ctx.filter = 'blur(15px)';
      break;
    case 'none':
      ctx.filter = 'none';
      break;
  }

  ctx.drawImage(
    source,
    input.rect.x,
    input.rect.y,
    width,
    height,
    output.rect.x,
    output.rect.y,
    output.rect.width,
    output.rect.height,
  );

  ctx.filter = "none";
}


export const CanvasUtils = {
  drawImageFromSource,
  renderCropArea,
}