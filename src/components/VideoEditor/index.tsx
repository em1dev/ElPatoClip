import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { Layer, Source } from '../../types';
import { VideoCanvas } from '../VideoCanvas';
import { useFfmpeg } from '../../ffmpeg';
import { VideoHeader } from '../Molecules/VideoHeader';

const VideoEditor = () => {
  const [videoMetadata, setVideoMetadata] = useState<{
    currentTime: number,
    totalTime: number
  }>({ currentTime: 0, totalTime: 0});
  const { editVideo } = useFfmpeg();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [layers, setLayers] = useState<Array<Layer>>([{ 
    id: 0,
    borderColor: '#FF0099',
    zIndex: 0,
    input: { rect: { x: 0, y: 0, width: 1080 / 2, height: 1920 / 2 } },
    output: { rect: { x: 0, y: 0, width: 1080 / 2, height: 1920 / 2 } },
  },{
    id: 1,
    borderColor: '#0066FF',
    zIndex: 1,
    input: { rect: { x: 0, y: 0, width: 1080 / 2, height: 1920 / 2 } },
    output: { rect: { x: 0, y: 0, width: 1080 / 2, height: 1920 / 2 } },
  }]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const onPlay = () => { setIsPlaying(true); };
    const onStop = () => { setIsPlaying(false); };

    const onSeek = () => {
      if (!videoRef.current) return;
      setVideoMetadata({
        currentTime: videoRef.current.currentTime,
        totalTime: videoRef.current.duration
      })
    }

    video.addEventListener('play', onPlay);
    video.addEventListener('ended', onStop);
    video.addEventListener('pause', onStop);
    video.addEventListener('timeupdate', onSeek);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('ended', onStop);
      video.removeEventListener('pause', onStop);
      video.removeEventListener('timeupdate', onSeek);
    }
  }, []);

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

  const onRender = async () => {
    const layer1 = layers[0]!;
    const urlBlob = await editVideo('./video/libre.mp4', {
      startTime: 0,
      endTime: 0,
      layer: layer1
    });

    const a = document.createElement('a');
    a.href = urlBlob;
    document.body.appendChild(a);
    a.download = 'out.mp4';
    a.click();
    document.body.removeChild(a);
  }

  const onHeaderPlayClicked = useCallback((value: boolean) => {
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

  return (
    <S.Container>
      <VideoHeader
        currentTime={videoMetadata.currentTime}
        videoLength={videoMetadata.totalTime}
        isPlaying={isPlaying}
        setIsPlaying={onHeaderPlayClicked}
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
      <video hidden ref={videoRef} width={960} height={540} src={'./video/libre.mp4'}></video>
      <button onClick={onRender}>Render</button>
    </S.Container>
  )
}

export default VideoEditor;