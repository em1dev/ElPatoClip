import { useCallback, useEffect, useRef, useState } from "react";
import { FFmpeg, createFFmpeg } from '@ffmpeg/ffmpeg';
import { Layer } from "../types";
import { MathUtils } from "../Utils/MathUtils";

interface VideoSettings {
  startTime: number,
  endTime: number,
  layer: Array<Layer>
}

export const useFfmpeg = (
  logger: (output: string) => void,
) => {
  const logRef = useRef<(output: string) => void>();
  const [wasmLoaded, setWasmLoaded] = useState<boolean>(false);
  const ffmpegRef = useRef<FFmpeg>();

  useEffect(() => {
    (async () => {
      const ffmpeg = createFFmpeg({
        corePath: "/ffmpeg/ffmpeg-core.js",
        log: true,
        progress: (trace) => {
          console.log(trace.ratio);
        },
      });
      ffmpegRef.current = ffmpeg;
      ffmpeg.setLogger((log) => {
        if (!logRef.current) return;
        logRef.current(log.message);
      });
      await ffmpeg.load();
      setWasmLoaded(true);
    })()
  }, []);

  useEffect(() => {
    logRef.current = logger;
  }, [logger]);

  const downloadVideo = useCallback(async (videoUrl:string) => {
    const resp = await fetch(videoUrl);
    const respData = await resp.blob();
    const dataAsArray = new Uint8Array(await respData.arrayBuffer());
    return dataAsArray;
  }, [])

  const generateFilter = useCallback((options: VideoSettings) => {
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
  }, [])

  const editVideo = useCallback(async (sourceUrl: string, options: VideoSettings) => {
    if (!ffmpegRef.current) throw new Error('not loaded');

    // TODO - get from src instead
    const videoData = await downloadVideo(sourceUrl);
    const filter = generateFilter(options);

    ffmpegRef.current.FS('writeFile', 'test.mp4', videoData);
  
    const startTimeAsText = MathUtils.secondsToReadableText(options.startTime, true);
    const endTimeAsText = MathUtils.secondsToReadableText(options.endTime, true);

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
  }, [downloadVideo, generateFilter])

  return {
    editVideo,
    wasmLoaded,
  }
}