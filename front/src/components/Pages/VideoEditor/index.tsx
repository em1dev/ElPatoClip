import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { Layer, Source, TimeSlice } from '../../../types';
import { VideoCanvas } from '../../Organisms/VideoCanvas';
import { VideoHeader } from '../../Organisms/VideoHeader';
import { Timeline } from '../../Molecules/Timeline';
import { VideoFooter } from '../../Organisms/VideoFooter';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { ExportModal } from './ExportModal';

export interface VideoEditorProps {
  videoUrl: string
}

const VideoEditor = ({ videoUrl }: VideoEditorProps) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [cropTime, setCropTime] = useState<TimeSlice>({
    startTime: 0,
    endTime: 5
  })
  const [videoMetadata, setVideoMetadata] = useState<{
    currentTime: number,
    totalTime: number
  }>({ currentTime: 0, totalTime: 0});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [layers, setLayers] = useState<Array<Layer>>([{ 
    id: 0,
    borderColor: '#FF0099',
    zIndex: 0,
    input: { rect: { x: 0, y: 0, width: 1080 / 2, height: 1920 / 2 } },
    output: { rect: { x: 0, y: 0, width: 1080, height: 1920} },
  },
  {
    id: 1,
    borderColor: '#0066FF',
    zIndex: 1,
    input: { rect: { x: 0, y: 0, width: 1920 / 2, height: 1080 / 2 } },
    output: { rect: { x: 0, y: 0, width: 1080, height: 800 } },
  },
]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const onPlay = () => { setIsPlaying(true); };
    const onStop = () => { setIsPlaying(false); };

    video.addEventListener('play', onPlay);
    video.addEventListener('ended', onStop);
    video.addEventListener('pause', onStop);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('ended', onStop);
      video.removeEventListener('pause', onStop);
    }
  }, []);

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    setVideoMetadata({
      currentTime: videoRef.current.currentTime,
      totalTime: videoRef.current.duration
    })
  }, []));

  const toggleVideoPlayback = useCallback(() => {
    if (!videoRef.current) return;
  
    if (videoRef.current.paused) {
      videoRef.current.play()
      return;
    }
    videoRef.current.pause();
  }, [videoRef]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== ' ') return
      e.preventDefault();
      toggleVideoPlayback();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ') return
      e.preventDefault();
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    }
  }, [toggleVideoPlayback]);

  const onInputChange = (id: number, src: Source) => {
    setLayers(prev => (
      prev.map(i => i.id !== id ? i : {
        ...i,
        input: src
      } satisfies Layer)
    ));
  };

  const onOutputChange = (id: number, output: Source) => {
    setLayers(prev => (
      prev.map(i => i.id !== id ? i : {
        ...i,
        output: output
      } satisfies Layer)
    ));
  }

  const onPlayButtonClicked = useCallback((value: boolean) => {
    value ? videoRef.current?.play() : videoRef.current?.pause()
  }, []);

  const inputLayers: Array<Layer> = layers.map((item) => ({
    ...item,
    input: undefined,
    output: item.input!,
  }));

  const outputLayers: Array<Layer> = layers.map((item) => ({
    ...item,
    output: item.output,
    input: item.input
  }));

  const seekTo = useCallback((value: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value;
  }, []);

  const onRenderClick = () => {
    setIsExporting(true);
  }

  return (
    <S.Container>

      {isExporting && (
        <S.ModalOverlay>
          <ExportModal 
            videoUrl={videoUrl}
            layers={layers}
            endTime={cropTime.endTime}
            startTime={cropTime.startTime}
          />
        </S.ModalOverlay>
      )}

      <VideoHeader
        onRenderClick={onRenderClick}
        currentTime={videoMetadata.currentTime}
        videoLength={videoMetadata.totalTime}
      />
      <S.VideoContainer>
        <VideoCanvas
          toggleVideoPlayback={toggleVideoPlayback}
          layers={inputLayers}
          onOutputChange={onInputChange}
          videoRef={videoRef}
          renderVideo
        />

        <VideoCanvas
          toggleVideoPlayback={toggleVideoPlayback}
          onOutputChange={onOutputChange}
          layers={outputLayers}
          videoRef={videoRef}
          videoResolution={{ height: 1920, width: 1080 }}
        />
      </S.VideoContainer>
      <VideoFooter 
        isPlaying={isPlaying}
        setIsPlaying={onPlayButtonClicked}
        onBackwardClicked={() => {}}
        onForwardClicked={() => {}}
        onToEndClicked={() => {}}
        onToStartClicked={() => {}}
      />
      <S.TimelineContainer>
        <Timeline 
          setCropTime={setCropTime}
          cropTime={cropTime}
          currentTime={videoMetadata.currentTime}
          totalDuration={videoMetadata.totalTime}
          seekTo={seekTo}
        />
      </S.TimelineContainer>
      <video hidden ref={videoRef} width={960} height={540} src={videoUrl}></video>
    </S.Container>
  )
}

export default VideoEditor;