import { useEffect, useRef, useState } from "react";
import { FFmpeg, createFFmpeg } from '@ffmpeg/ffmpeg';
import { Layer } from "../types";

const INPUT_VIDEO_SIZE = { h: 1080, w: 1920 };
const OUTPUT_VIDEO_SIZE = { w: 1080, h: 1920 };

interface VideoLayer {
  scale: number,
  position: {
    x: number,
    y: number
  }
}

// TODO - expand this to an infinite amount of sections
interface VideoSettings {
  startTime: number,
  endTime: number,
  layer: Layer
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
    const filter = await generateFilter(options);

    ffmpegRef.current.FS('writeFile', 'test.mp4', videoData);
  
    await ffmpegRef.current.run(
      '-to', '00:10', '-ss', '00:00',
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

  const generateFilter = async (options: VideoSettings) => {
    if (!ffmpegRef.current) throw new Error('ffmpeg loaded');

    const filter = `
      [0:v]crop=${options.layer.src.rect.width}:${options.layer.src.rect.height}:${options.layer.src.rect.x}:${Math.floor(options.layer.src.rect.y)},scale=h=${options.layer.output.rect.height}:${options.layer.output.rect.width}[video]; \
      [0:v]crop=${options.layer.src.rect.width}:${options.layer.src.rect.height}:${options.layer.src.rect.x}:${options.layer.src.rect.y},avgblur=10[bg]; \
      [bg][video]overlay=${(options.layer.output.rect.x)}:${options.layer.output.rect.y}
      `
    ;

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