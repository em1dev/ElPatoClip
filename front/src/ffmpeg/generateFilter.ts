import { MathUtils } from "../Utils/MathUtils";
import { Layer } from "../types";

export interface VideoSettings {
  startTime: number,
  endTime: number,
  layer: Array<Layer>
}

export const generateFilter = (options: VideoSettings) => {

  let filter = '[0:v]crop=1920:1080:0:0,scale=1080:1920[bg];';

  for (const layer of options.layer) {
    if (!layer.input) continue;
    const { height: inputHeight, width: inputWidth } = MathUtils.calcualtedInputAspectRatioBasednOutput(layer.input.rect, layer.output.rect);
    filter += `[0:v]crop=${inputWidth}:${inputHeight}:${layer.input!.rect.x}:${layer.input!.rect.y}[croplayer${layer.id}];`;
    filter += `[croplayer${layer.id}]scale=${layer.output.rect.width}:${layer.output.rect.height}[layer${layer.id}];`;
    filter += `[bg][layer${layer.id}]overlay=${(layer.output.rect.x)}:${layer.output.rect.y}[bg];`;
  }

  filter = filter.slice(0, filter.length - 5);
  /*
  return `
    [0:v]crop=${options.layer[0].input!.rect.width}:${options.layer[0].input!.rect.height}:${options.layer[0].input!.rect.x}:${Math.floor(options.layer[0].input!.rect.y)},scale=h=${options.layer[0].output.rect.height}:${options.layer[0].output.rect.width}[video]; \
    [0:v]crop=${options.layer[0].input!.rect.width}:${options.layer[0].input!.rect.height}:${options.layer[0].input!.rect.x}:${options.layer[0].input!.rect.y},avgblur=10[bg]; \
    [bg][video]overlay=${(options.layer[0].output.rect.x)}:${options.layer[0].output.rect.y}
    `
  ;
  */

  return filter;
};