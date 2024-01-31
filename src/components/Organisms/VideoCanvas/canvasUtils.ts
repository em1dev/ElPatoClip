import { Rect, Source } from "../../../types";

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

const drawImageFromSource = (ctx: CanvasRenderingContext2D, source: CanvasImageSource, input:Source, output: Source) => {
  let width = output.rect.width;
  let height = output.rect.height;

  const scaling = input.rect.height / output.rect.height;
  if (input.rect.width > output.rect.width * scaling) {
    height *= scaling; 
    width *= scaling;
  } else {
    const scaling2 = input.rect.width / output.rect.width;
    height *= scaling2;
    width *= scaling2;
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
}


export const CanvasUtils = {
  drawImageFromSource,
  renderCropArea,
}