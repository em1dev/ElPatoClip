import { useEffect, useRef, useState } from "react";
import { FFmpeg, createFFmpeg } from '@ffmpeg/ffmpeg';
import { Layer } from "../types";
import { MathUtils } from "../Utils/MathUtils";

const INPUT_VIDEO_SIZE = { h: 1080, w: 1920 };
const OUTPUT_VIDEO_SIZE = { w: 1080, h: 1920 };

// TODO - expand this to an infinite amount of sections
interface VideoSettings {
  startTime: number,
  endTime: number,
  layer: Array<Layer>
}

export const useFfmpeg = () => {
  const [wasmLoaded, setWasmLoaded] = useState<boolean>(false);
  const ffmpegRef = useRef<FFmpeg>();

  useEffect(() => {
    (async () => {
      const ffmpeg = createFFmpeg({
        corePath: "../../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js",
        log: true,
      });
      ffmpegRef.current = ffmpeg;
      await ffmpeg.load();
      setWasmLoaded(true);
    })()
  }, []);

  const downloadVideo = async (videoUrl:string) => {
    const resp = await fetch(videoUrl);
    const respData = await resp.blob();
    const dataAsArray = new Uint8Array(await respData.arrayBuffer());
    return dataAsArray;
  }

  const editVideo = async (sourceUrl: string, options: VideoSettings) => {
    if (!ffmpegRef.current) throw new Error('not loaded');

    // TODO - get from src instead
    const videoData = await downloadVideo(sourceUrl);
    const filter = generateFilter(options);
    console.log(filter);

    ffmpegRef.current.FS('writeFile', 'test.mp4', videoData);
  
    const startTimeAsText = MathUtils.secondsToReadableText(options.startTime);
    const endTimeAsText = MathUtils.secondsToReadableText(options.endTime);

    await ffmpegRef.current.run(
      '-to', endTimeAsText, '-ss', startTimeAsText,
      '-i', 'test.mp4',
      '-vcodec', 'h264', '-acodec', 'aac',
      '-filter_complex',
      filter,
      'output.mp4', 
    );
    const data = await ffmpegRef.current.FS('readFile', 'output.mp4');
    const videoUrl =  URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    return videoUrl;
  }

  const generateFilter = (options: VideoSettings) => {
    if (!ffmpegRef.current) throw new Error('ffmpeg loaded');

    let filter = '[0:v]crop=1920:1080:0:0,scale=1080:1920[bg];';
    //let filter = '';
    for (const layer of options.layer) {
      if (!layer.input) continue;
      const { height: inputHeight, width: inputWidth } = MathUtils.calcualtedInputAspectRatioBasednOutput(layer.input.rect, layer.output.rect);
      filter += `[0:v]crop=${inputWidth}:${inputHeight}:${layer.input!.rect.x}:${layer.input!.rect.y}[croplayer${layer.id}];`;
      filter += `[croplayer${layer.id}]scale=${layer.output.rect.width}:${layer.output.rect.height}[layer${layer.id}];`;
      filter += `[bg][layer${layer.id}]overlay=${(layer.output.rect.x)}:${layer.output.rect.y}[bg];`;
    }

    filter = filter.slice(0, filter.length - 5);
    console.log(filter, options);
    //filter += '[bg]';

    /*
    return `
      [0:v]crop=${options.layer[0].input!.rect.width}:${options.layer[0].input!.rect.height}:${options.layer[0].input!.rect.x}:${Math.floor(options.layer[0].input!.rect.y)},scale=h=${options.layer[0].output.rect.height}:${options.layer[0].output.rect.width}[video]; \
      [0:v]crop=${options.layer[0].input!.rect.width}:${options.layer[0].input!.rect.height}:${options.layer[0].input!.rect.x}:${options.layer[0].input!.rect.y},avgblur=10[bg]; \
      [bg][video]overlay=${(options.layer[0].output.rect.x)}:${options.layer[0].output.rect.y}
      `
    ;
    */

    return filter;
  }

  const editVideoOld = async (sourceUrl:string, options: VideoSettings) => {
    const topWidth = 1080;
    const topHeight = 960;
    const bottomHeight = 960;
    const bottomWidth = 1080;
    const width = 1080;
    const height = 1920;
    const widthSmallVideo = 1080;
    const heightSmallVideo = 600;   

    if (!ffmpegRef.current) return;
    const videoData = await downloadVideo(sourceUrl);
    ffmpegRef.current.FS('writeFile', 'test.mp4', videoData);
  
    //[0:v]crop=${bottomWidth}:${bottomHeight}:0:${topHeight},drawbox=c=cyan:t=fill[bg]; \
    await ffmpegRef.current.run(
      '-to', '00:20', '-ss', '00:05',
      '-i', 'test.mp4',
      '-vcodec', 'h264', '-acodec', 'aac',
      '-filter_complex',
      `
      [0:v]crop=${topWidth}:${topHeight}:500:0[sliced_top]; \
      [0:v]crop=${1920}:${1080}:0:0,scale=${widthSmallVideo}:${heightSmallVideo}[sliced_bottom]; \
      [0:v]crop=${bottomWidth}:${bottomHeight}:0:0,scale=h=${bottomHeight}:w=-1,avgblur=10[bg]; \
      [bg][sliced_bottom]overlay=${(bottomWidth / 2) - (widthSmallVideo / 2)}:${(bottomHeight / 2) - (heightSmallVideo / 2)}[bottom_out];
      [sliced_top][bottom_out]vstack`,
      /*
      `[0:v]crop=${topWidth}:${topHeight}:500:0[sliced_top]; \
            [0:v]crop=${bottomWidth}:${bottomHeight}:0:${topHeight}[sliced_bottom]; \
            [sliced_top][sliced_bottom]vstack`,
      */
      'output.mp4', 
    );
    const data = await ffmpegRef.current.FS('readFile', 'output.mp4');
    const videoUrl =  URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    return videoUrl;
  }

  return {
    editVideo,
    wasmLoaded,
  }
}