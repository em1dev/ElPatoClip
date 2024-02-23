import * as S from './styles';
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Layer, TimeSlice } from "../../../../types"
import { useVideo } from "../useVideo";
import { useRenderLoop } from "../../../../hooks/useRenderLoop";
import { VideoCanvas } from "../../../Organisms/VideoCanvas";
import { Button } from '../../../Atoms/Button';
import { useCanvasRecording } from './useCanvasRecording';
import { useEventListener } from '../../../../hooks/useEventListener';

export interface VideoExporterProps {
  videoUrl: string,
  layers: Array<Layer>,
  timeSlice: TimeSlice
}

export const VideoExporter = ({
  layers,
  timeSlice,
  videoUrl
}: VideoExporterProps) => {
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    seekTo, setPlayback, toggleVideoPlayback,
  } = useVideo(videoRef);

  const { outputUrl, record } = useCanvasRecording(outputCanvasRef, videoRef);

  useEventListener<HTMLVideoElement, Event>(videoRef, 'loadeddata', () => {
    seekTo(timeSlice.startTime);
    setPlayback(true);
    const videoDuration = timeSlice.endTime - timeSlice.startTime;
    record(videoDuration * 1000);
  });

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
  }, []));

  const download = useCallback((blobUrl: string) => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = blobUrl;
    a.download = "test.webm";
    a.click();
  }, []);

  useEffect(() => {
    if (!outputUrl) return;
    setPlayback(false);
  }, [outputUrl, setPlayback]);

  const renderLayers: Array<Layer> = useMemo(() => layers.map((item) => ({
    ...item,
    locked: true,
    output: item.output,
    input: item.input
  })), [layers]);

  return (
    <S.Container>
      <S.VideoContainer>
        {outputUrl ? (
          <video controls src={outputUrl} />
        ) : (
          <VideoCanvas
            ref={outputCanvasRef}
            videoResolution={{ width: 1080, height: 1920 }}
            toggleVideoPlayback={toggleVideoPlayback}
            layers={renderLayers}
            videoRef={canvasRef}
          />
        )}
      </S.VideoContainer>
      <canvas hidden ref={canvasRef} width={1920} height={1080} />
      <video hidden ref={videoRef} src={videoUrl} width={1920} height={1080} />
      { outputUrl ?
        <Button theme='light' onClick={() => download(outputUrl)}>Download</Button>
        : 
        <h2>Rendering...</h2>
      }
    </S.Container>
  )
}