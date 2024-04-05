import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { VideoEvents } from './VideoEvents';
import { Content } from './Content';
import { EditorHeader } from './Header';
import { Footer } from './Footer';
import { useEditorState } from '../../../store/EditorState/useEditorState';
import { EditorSideBar } from '../../Molecules/Editor/EditorSideBar';

export interface VideoEditorProps {
  onExport: () => void,
}

const VideoEditor = ({ onExport }: VideoEditorProps) => {
  const videoUrl = useEditorState(state => state.videoBlobUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  const setVideoRef = useEditorState(state => state.setVideoRef);
  const toggleVideoPlayback = useEditorState(state => state.toggleVideoPlayback);

  useEffect(() => {
    setVideoRef(videoRef);
  }, [videoRef, setVideoRef]);

  const videoCanvasRef = useRef<HTMLCanvasElement>(null);

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    if (!videoCanvasRef.current) return;
    const ctx = videoCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
  }, []));

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== ' ') return;
      e.preventDefault();
      toggleVideoPlayback();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ') return;
      e.preventDefault();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [toggleVideoPlayback]);

  if (!videoUrl) return null;

  return (
    <>
      <S.GlobalStyles />

      <VideoEvents />

      <S.Container>
        <EditorHeader onExportClick={onExport} />
        <S.InnerContainer>
          <S.CanvasContainer>
            <Content videoCanvasRef={videoCanvasRef} />
            <Footer />
          </S.CanvasContainer>
          <S.RightContainer>
            <EditorSideBar />
          </S.RightContainer>
        </S.InnerContainer>
      </S.Container>

      <canvas hidden ref={videoCanvasRef} width={1920} height={1080} />
      <video autoPlay preload='auto' loop hidden ref={videoRef} width={960} height={540} src={videoUrl}></video>
    </>
  );
};

export default VideoEditor;