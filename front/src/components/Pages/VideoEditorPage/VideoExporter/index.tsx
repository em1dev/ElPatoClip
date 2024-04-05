import * as S from './styles';
import { useCallback, useEffect, useRef } from 'react';
import { useRenderLoop } from '../../../../hooks/useRenderLoop';
import { VideoCanvas } from '../../../Molecules/Editor/VideoCanvas';
import { useCanvasRecording } from './useCanvasRecording';
import { useEventListener } from '../../../../hooks/useEventListener';
import { useEditorState } from '../../../../store/EditorState/useEditorState';
import { ExportSection } from './ExportSection';
import { Loading } from '../../../Atoms/Loading';

export const VideoExporter = () => {
  const resetInteractions = useEditorState((state) => state.resetInteractions);
  const videoBlobUrl = useEditorState((state) => state.videoBlobUrl);
  const timeSlice = useEditorState((state) => state.timeSlice);

  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { seekTo, setPlayback, setVideoRef } = useEditorState();

  const { outputUrl, record } = useCanvasRecording(outputCanvasRef, videoRef);

  useEffect(() => {
    resetInteractions();
  }, [resetInteractions]);

  useEffect(() => {
    setVideoRef(videoRef);
  }, [videoRef, setVideoRef]);

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

  useEffect(() => {
    if (!outputUrl) return;
    setPlayback(false);
  }, [outputUrl, setPlayback]);

  if (!videoBlobUrl) return null;

  return (
    <S.Container>
      <S.VideoContainer>
        {outputUrl ? (
          <video controls src={outputUrl} />
        ) : (
          <VideoCanvas
            withPadding={false}
            ref={outputCanvasRef}
            direction='portrait'
            videoRef={canvasRef}
            type='output'
            locked
          />
        )}
      </S.VideoContainer>
      <canvas hidden ref={canvasRef} width={1920} height={1080} />
      <video preload='auto' hidden ref={videoRef} src={videoBlobUrl} width={1920} height={1080} />

      <S.RightContainer>

        { outputUrl ?  (
          <ExportSection videoUrl={outputUrl} />
        ) : (
          <S.ExportingLoaderContainer>
            <p>Recording video...</p>
            <Loading />
          </S.ExportingLoaderContainer>
        )}

      </S.RightContainer>
    </S.Container>
  );
};