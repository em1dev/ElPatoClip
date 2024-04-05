import { MathUtils } from '../../../../../../Utils/MathUtils';
import { Layer, Point } from '../../../../../../types';

export const renderResizeInformation = (ctx: CanvasRenderingContext2D, layer: Layer, scalingFactor: number, padding: number) => {
  ctx.save();
  ctx.beginPath();

  const boxPadding = 5 * scalingFactor;
  const yOffset = boxPadding + (5 * scalingFactor);
  const text = `${Math.ceil(layer.output.rect.width)}x${Math.ceil(layer.output.rect.height)}`;
  ctx.font = `bold ${15 * scalingFactor}px monospace`;
  const textMetrics = ctx.measureText(text);

  const centerPointBot: Point = {
    x: layer.output.rect.x + (layer.output.rect.width / 2),
    y: (layer.output.rect.y + layer.output.rect.height)
  };

  const posWithPadding = MathUtils.addPosition(centerPointBot, { 
    x: padding, 
    y: (padding + yOffset)
  });

  const { x, y } = MathUtils.addPosition(posWithPadding, { 
    x: -textMetrics.width / 2,
    y: 0 
  });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const width = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft;
  const height = textMetrics.fontBoundingBoxAscent;

  ctx.roundRect(x - boxPadding,
    y - boxPadding,
    width + (boxPadding * 2),
    height + (boxPadding * 2), 
    5 * scalingFactor
  );
  ctx.fillStyle = '#FFEB39';
  ctx.fill();

  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillText(text, x, y);


  ctx.closePath();
  ctx.restore();
};