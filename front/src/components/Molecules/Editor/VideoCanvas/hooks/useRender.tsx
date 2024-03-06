import { RefObject, useCallback } from "react";
import { useRenderLoop } from "../../../../../hooks/useRenderLoop";
import { CANVAS_PADDING } from "../settings";
import { Layer, Size } from "../../../../../types";
import { CanvasUtils } from "../util/canvasUtils";

export const useRender = (
  outputCanvasRef: RefObject<HTMLCanvasElement>,
  inputCanvasRef: RefObject<CanvasImageSource>,
  videoResolution: Size,
  selectedLayer: Layer | undefined,
  hoveredLayer: Layer | undefined,
  layers: Array<Layer>,
  renderInput: boolean,
  hasInteracted: boolean,
  withPadding: boolean
) => {
  const padding = withPadding ? CANVAS_PADDING : 0;

  const clipVideoArea = useCallback((ctx: CanvasRenderingContext2D) => {
    // clip canvas to have border radius
    const canvasRect = { x: padding, y: padding, width: videoResolution.width,  height: videoResolution.height };
    CanvasUtils.clipRect(ctx, canvasRect, 10);
  }, [videoResolution, padding]);

  const onRender = useCallback(() => {
    const ctx = outputCanvasRef.current?.getContext('2d');
    const inputCanvas = inputCanvasRef.current;

    if (!ctx || !inputCanvas) return;
    ctx.reset();
    ctx.save();

    clipVideoArea(ctx);

    if (renderInput) {
      ctx.drawImage(inputCanvas, padding, padding, videoResolution.width,  videoResolution.height);
      // dark overlay
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
    } else {
      // bg
      ctx.fillStyle = 'rgba(0,0,0,1)';
    }
    ctx.fillRect(padding, padding, videoResolution.width,  videoResolution.height);

    ctx.restore();
    ctx.save();

    for (const { output, input, filter, shape } of layers) {
      clipVideoArea(ctx);
      CanvasUtils.drawImageFromSource(ctx, inputCanvas, input ?? output, output, filter, shape, padding);
    }

    ctx.restore();
    if (hoveredLayer && !hasInteracted) {
      CanvasUtils.renderCropArea(ctx, hoveredLayer.output.rect, hoveredLayer.borderColor, false);
    }

    if (selectedLayer) {
      CanvasUtils.renderCropArea(ctx, selectedLayer.output.rect, selectedLayer.borderColor, true);
    }

    ctx.restore();
  }, [layers, renderInput, videoResolution, hoveredLayer, selectedLayer, hasInteracted, inputCanvasRef, clipVideoArea, outputCanvasRef, padding ]);

  useRenderLoop(onRender);
}