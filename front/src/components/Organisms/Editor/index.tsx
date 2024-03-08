import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { Layer, TimeSlice, Source } from '../../../types';
import { VideoCanvas } from '../../Molecules/Editor/VideoCanvas';
import { ExportModal } from '../../Pages/VideoEditorPage/ExportModal';
import { useVideo } from '../../Pages/VideoEditorPage/useVideo';
import { LeftContainer } from './LeftContainer';
import { EditorSideBar } from '../../Molecules/Editor/EditorSideBar';

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
  const [isExporting, setIsExporting] = useState<boolean>(false);
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
    onExport()
    //setIsExporting(true);
  }

  // TODO - remove modal
  const onCloseModalIsClicked = () => {
    setIsExporting(false);
  }

  return (
    <>
      <S.GlobalStyles />

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

      <S.Container>
        <S.SideBySideContainer>
          <S.PotraitVideo>
            <VideoCanvas
              hoverLayerId={hoverLayerId}
              selectedLayerId={selectedLayerId}
              setHoverLayerId={setHoverLayerId}
              setSelectedLayerId={setSelectedLayerId}
              direction='portrait'
              onOutputChange={onOutputChange}
              layers={outputLayers}
              videoRef={videoCanvasRef}
              withPadding
            />         
          </S.PotraitVideo>

          <LeftContainer 
            hoverLayerId={hoverLayerId}
            selectedLayerId={selectedLayerId}
            setHoverLayerId={setHoverLayerId}
            setSelectedLayerId={setSelectedLayerId}
            cropTime={cropTime}
            inputLayers={inputLayers}
            onInputChange={onInputChange}
            onRenderClick={onRenderClick}
            seekWithAnimation={seekWithAnimation}
            setCropTime={setCropTime}
            videoCanvasRef={videoCanvasRef}
            video={video}
          />

        </S.SideBySideContainer>
        <S.SidePanelContainer>
          <EditorSideBar 
            layers={layers}
            selectedLayerId={selectedLayerId}
            setLayers={setLayers}
            setSelectedLayerId={setSelectedLayerId}
          />
        </S.SidePanelContainer>
      </S.Container>

      <canvas hidden ref={videoCanvasRef} width={1920} height={1080} />
      <video loop hidden ref={videoRef} width={960} height={540} src={videoUrl}></video>
    </>
  )
}

export default VideoEditor;