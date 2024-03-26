import { useCallback, useEffect, useRef, useState } from 'react';
import { FFmpeg, createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { MathUtils } from '../Utils/MathUtils';
import { VideoSettings, generateFilter } from './generateFilter';

const INPUT_FILE = 'in.mp4';

export const useFfmpeg = (
  logger: (output: string) => void,
) => {
  const logRef = useRef<(output: string) => void>();
  const [wasmLoaded, setWasmLoaded] = useState<boolean>(false);
  const ffmpegRef = useRef<FFmpeg>();

  useEffect(() => {
    (async () => {
      try {
        const ffmpeg = createFFmpeg({
          corePath: '/ffmpeg/ffmpeg-core.js',
          log: true,
        });
        ffmpegRef.current = ffmpeg;
        ffmpeg.setLogger((log) => {
          if (!logRef.current) return;
          logRef.current(log.message);
        });
        await ffmpeg.load();
        setWasmLoaded(true);
      } catch (err) {
        if (!logRef.current) return;
        logRef.current('ERROR - loading ffmpeg wasm');
        if (err instanceof Error) {
          logRef.current(err.message);
        }
      }
    })();
  }, []);

  useEffect(() => {
    logRef.current = logger;
  }, [logger]);

  const editVideo = useCallback(async (source: string | Blob | File, options: VideoSettings) => {
    if (!ffmpegRef.current) throw new Error('not loaded');

    const videoData = await fetchFile(source);
    const filter = generateFilter(options);

    ffmpegRef.current.FS('writeFile', INPUT_FILE, videoData);
  
    const startTimeAsText = MathUtils.secondsToReadableText(options.startTime, true);
    const endTimeAsText = MathUtils.secondsToReadableText(options.endTime, true);

    await ffmpegRef.current.run(
      '-to', endTimeAsText, '-ss', startTimeAsText,
      '-i', INPUT_FILE,
      '-vcodec', 'h264', '-acodec', 'aac',
      '-filter_complex',
      filter,
      'output.mp4', 
    );
    const data = ffmpegRef.current.FS('readFile', 'output.mp4');
    const videoUrl =  URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    return videoUrl;
  }, []);

  const cancel = useCallback(() => {
    if (!ffmpegRef.current) return;
    ffmpegRef.current.exit();
  }, []);

  return {
    editVideo,
    wasmLoaded,
    cancel,
  };
};