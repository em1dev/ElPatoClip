import { MathUtils } from "../Utils/MathUtils";
import { Layer } from "../types";

export interface VideoSettings {
  startTime: number,
  endTime: number,
  layer: Array<Layer>
}

export const generateFilter = (options: VideoSettings) => {

  const background = 'drawbox=0:0:1080:1920:#252525@1:t=fill';
  let filter = `[0:v]crop=1920:1080:0:0,scale=1080:1920,${background}[bg];`;
  const layersSorted = options.layer.sort((a, b) => a.zIndex - b.zIndex);

  for (const layer of layersSorted) {
    if (!layer.input) continue;
    const secondaryFilter = layer.filter === 'none' ? '' : ',gblur=sigma=20';
    const { height: inputHeight, width: inputWidth } = MathUtils.calcualtedInputAspectRatioBasednOutput(layer.input.rect, layer.output.rect);
    filter += `[0:v]crop=${inputWidth}:${inputHeight}:${layer.input!.rect.x}:${layer.input!.rect.y}[croplayer${layer.id}];`;
    filter += `[croplayer${layer.id}]scale=${layer.output.rect.width}:${layer.output.rect.height}${secondaryFilter}[layer${layer.id}];`;
    filter += `[bg][layer${layer.id}]overlay=${(layer.output.rect.x)}:${layer.output.rect.y}[bg];`;
  }

  filter = filter.slice(0, filter.length - 5);

  return filter;
};