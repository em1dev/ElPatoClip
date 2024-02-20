import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { Layer, Source, TimeSlice } from '../../../types';
import { VideoCanvas } from '../../Organisms/VideoCanvas';
import { VideoHeader } from '../../Organisms/VideoHeader';
import { Timeline } from '../../Molecules/Timeline';
import { VideoFooter } from '../../Organisms/VideoFooter';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { ExportModal } from './ExportModal';
import { useVideo } from './useVideo';
import { LayerEditor } from './LayerEditor';

export interface VideoEditorProps {
  videoUrl: string
}

const VideoEditor = ({ videoUrl }: VideoEditorProps) => {
  const [seekWithAnimation, setSeekWithAnimation] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    seekBackwards, seekForward, seekTo,
    seekToEnd, seekToStart, setPlayback,
    toggleMute, toggleVideoPlayback,
    isMuted, isPlaying
  } = useVideo(videoRef, setSeekWithAnimation);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [cropTime, setCropTime] = useState<TimeSlice>({
    startTime: 0,
    endTime: 5
  })
  const [videoMetadata, setVideoMetadata] = useState<{
    currentTime: number,
    totalTime: number
  }>({ currentTime: 0, totalTime: 0});
  const [layers, setLayers] = useState<Array<Layer>>([{ 
    id: 0,
    borderColor: '#FF0099',
    zIndex: 0,
    input: { rect: { x: 0, y: 0, width: 1080 / 2, height: 1920 / 2 } },
    output: { rect: { x: 0, y: 0, width: 1080, height: 1920} },
    locked: false,
  },
  {
    id: 1,
    borderColor: '#0066FF',
    zIndex: 1,
    input: { rect: { x: 0, y: 0, width: 1920 / 2, height: 1080 / 2 } },
    output: { rect: { x: 0, y: 0, width: 1080, height: 800 } },
    locked: true
  },
]);

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    if (!videoCanvasRef.current) return;
    const ctx = videoCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
  }, []));

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    setVideoMetadata({
      currentTime: videoRef.current.currentTime,
      totalTime: videoRef.current.duration
    })
  }, []));

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

  const onRenderClick = () => {
    setIsExporting(true);
  }

  const onCloseModalIsClicked = () => {
    setIsExporting(false);
  }

  return (
    <S.Container>

      {isExporting && (
        <S.ModalOverlay>
          <ExportModal 
            closeModal={onCloseModalIsClicked}
            videoUrl={videoUrl}
            layers={layers}
            endTime={cropTime.endTime}
            startTime={cropTime.startTime}
          />
        </S.ModalOverlay>
      )}

      <VideoHeader
        onMuteToggle={toggleMute}
        isMuted={isMuted}
        onRenderClick={onRenderClick}
        currentTime={videoMetadata.currentTime}
        videoLength={videoMetadata.totalTime}
      />
      <S.VideoContainer>
        <VideoCanvas
          toggleVideoPlayback={toggleVideoPlayback}
          layers={inputLayers}
          onOutputChange={onInputChange}
          videoRef={videoCanvasRef}
          renderVideo
        />

        <VideoCanvas
          toggleVideoPlayback={toggleVideoPlayback}
          onOutputChange={onOutputChange}
          layers={outputLayers}
          videoRef={videoCanvasRef}
          videoResolution={{ height: 1920, width: 1080 }}
        />
      </S.VideoContainer>
      <VideoFooter 
        isPlaying={isPlaying}
        setIsPlaying={setPlayback}
        onBackwardClicked={seekBackwards}
        onForwardClicked={seekForward}
        onToEndClicked={seekToEnd}
        onToStartClicked={seekToStart}
      />
      <S.TimelineContainer>
        <Timeline 
          seekWithAnimation={seekWithAnimation}
          setCropTime={setCropTime}
          cropTime={cropTime}
          currentTime={videoMetadata.currentTime}
          totalDuration={videoMetadata.totalTime}
          seekTo={seekTo}
        />
      </S.TimelineContainer>
      <canvas hidden ref={videoCanvasRef} width={1920} height={1080} />
      <video hidden ref={videoRef} width={960} height={540} src={videoUrl}></video>
      <LayerEditor layers={layers} setLayer={setLayers} />
    </S.Container>
  )
}

export default VideoEditor;