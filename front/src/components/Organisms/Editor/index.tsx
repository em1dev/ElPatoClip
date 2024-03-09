import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { Layer, TimeSlice } from '../../../types';
import { useVideo } from '../../Pages/VideoEditorPage/useVideo';
import { Content } from './Content';
import { EditorHeader } from './Header';
import { Footer } from './Footer';
import { RightContainer } from './RightContainer';

export interface VideoEditorProps {
  videoUrl: string,
  layers: Array<Layer>,
  setLayers: Dispatch<SetStateAction<Array<Layer>>>,
  cropTime: TimeSlice,
  setCropTime: (value: TimeSlice) => void,
  onExport: () => void,
}

const VideoEditor = ({
  videoUrl,
  cropTime,
  layers,
  setCropTime,
  setLayers,
  onExport
}: VideoEditorProps) => {
  const [seekWithAnimation, setSeekWithAnimation] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = useVideo(videoRef, cropTime, setSeekWithAnimation);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
  const [hoverLayerId, setHoverLayerId] = useState<number | null>(null);

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    if (!videoCanvasRef.current) return;
    const ctx = videoCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
  }, []));

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== ' ') return
      e.preventDefault();
      video.toggleVideoPlayback();
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
  }, [video]);

  return (
    <>
      <S.GlobalStyles />

      <S.Container>
        <EditorHeader onExportClick={onExport} />
        <S.InnerContainer>
          <S.CanvasContainer>
            <Content
              hoverLayerId={hoverLayerId}
              layers={layers}
              selectedLayerId={selectedLayerId}
              setHoverLayerId={setHoverLayerId}
              setLayers={setLayers}
              setSelectedLayerId={setSelectedLayerId}
              videoCanvasRef={videoCanvasRef}
            />
            <Footer 
              cropTime={cropTime}
              video={video}
              seekWithAnimation={seekWithAnimation}
              setCropTime={setCropTime}
            />
          </S.CanvasContainer>
          <RightContainer 
            layers={layers}
            selectedLayerId={selectedLayerId}
            setLayers={setLayers}
            setSelectedLayerId={setSelectedLayerId}
          />
        </S.InnerContainer>
      </S.Container>

      <canvas hidden ref={videoCanvasRef} width={1920} height={1080} />
      <video loop hidden ref={videoRef} width={960} height={540} src={videoUrl}></video>
    </>
  )
}

export default VideoEditor;