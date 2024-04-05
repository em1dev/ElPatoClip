import { RefObject, useCallback } from 'react';
import { useRenderLoop } from '../../../../../../hooks/useRenderLoop';
import { CanvasUtils } from '../../util/canvasUtils';
import { CanvasMetadata } from '../useCanvasMetadata';
import { renderResizeInformation } from './renderResizeInformation';
import { Layer } from '../../../../../../types';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';


export const useRender = (
  layers: Array<Layer>,
  outputCanvasRef: RefObject<HTMLCanvasElement>,
  inputCanvasRef: RefObject<CanvasImageSource>,
  canvasMetadata: CanvasMetadata,
  renderInput: boolean,
  hasInteracted: boolean,
) => {
  const selectedLayerId = useEditorState(state => state.selectedLayer?.id);
  const hoveredLayerId = useEditorState(state => state.hoveredLayer?.id);

  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  const hoveredLayer = layers.find(l => l.id === hoveredLayerId);

  const { padding, videoResolution, scalingFactor } = canvasMetadata;

  const clipVideoArea = useCallback((ctx: CanvasRenderingContext2D) => {
    // clip canvas to have border radius
    const canvasRect = { x: padding, y: padding, width: videoResolution.width,  height: videoResolution.height };
    CanvasUtils.clipRect(ctx, canvasRect, 10);
  }, [videoResolution, padding]);

  const onRender = useCallback(() => {
    const ctx = outputCanvasRef.current?.getContext('2d');
    const outputCanvas = outputCanvasRef.current;
    const inputCanvas = inputCanvasRef.current;

    if (!ctx || !inputCanvas || !outputCanvas) return;
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
      CanvasUtils.renderCropArea(ctx, scalingFactor, hoveredLayer.output.rect, hoveredLayer.borderColor, false, padding);
    }

    if (selectedLayer) {
      CanvasUtils.renderCropArea(ctx, scalingFactor, selectedLayer.output.rect, selectedLayer.borderColor, true, padding);
      renderResizeInformation(ctx, selectedLayer, scalingFactor, padding);
    }

    ctx.restore();
  }, [scalingFactor, layers, renderInput, videoResolution, hoveredLayer, selectedLayer, hasInteracted, inputCanvasRef, clipVideoArea, outputCanvasRef, padding ]);

  useRenderLoop(onRender);
};