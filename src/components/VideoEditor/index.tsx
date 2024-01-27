import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { Layer, Source } from '../../types';
import InputCanvas from '../InputCanvas';
import { useFfmpeg } from '../../ffmpeg';

const VideoEditor = () => {
  const { editVideo } = useFfmpeg();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [layer1, setLayer1] = useState<Layer>({ 
    src: {
      rect: {
        x: 0,
        y: 0,
        width: 1080 / 2,
        height: 1920 / 2 
      }
    },
    output: {
      rect: {
        x: 0,
        y: 0,
        width: 1080 / 2,
        height: 1920 / 2
      }
    },
    outlineColor: 'red',
  });

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

  const onInputChange = (src: Source) => {
    setLayer1(prev => ({
      ...prev,
      src: src
    }))
  };

  const onOutputChange = (output: Source) => {
    setLayer1(prev => ({
      ...prev,
      output: output
    }))
  }

  const onRender = async () => {
    console.log('rendering...');
    console.log(layer1);
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

  return (
    <>
      <S.Container>
        <InputCanvas
          toggleVideoPlayback={toggleVideoPlayback}
          output={layer1.src}
          onOutputChange={onInputChange}
          videoRef={videoRef}
          renderVideo
          borderColor='red'
        />

        <InputCanvas
          toggleVideoPlayback={toggleVideoPlayback}
          borderColor='red'
          src={layer1.src}
          onOutputChange={onOutputChange}
          output={layer1.output}
          videoRef={videoRef}
          videoResolution={{ height: 1920, width: 1080 }}
        />
        <video autoPlay hidden ref={videoRef} width={960} height={540} src={'./video/libre.mp4'}></video>
      </S.Container>
      <button onClick={onRender}>Render</button>
    </>
  )
}

export default VideoEditor;