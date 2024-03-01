import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { Layer, TimeSlice, Source } from '../../../types';
import { VideoCanvas } from '../../Molecules/Editor/VideoCanvas';
import { ExportModal } from '../../Pages/VideoEditorPage/ExportModal';
import { useVideo } from '../../Pages/VideoEditorPage/useVideo';
import { LayerEditor } from '../../Molecules/Editor/LayerEditor';
import { LeftContainer } from './LeftContainer';

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
              toggleVideoPlayback={video.toggleVideoPlayback}
              onOutputChange={onOutputChange}
              layers={outputLayers}
              videoRef={videoCanvasRef}
              videoResolution={{ height: 1920, width: 1080 }}
            />         
          </S.PotraitVideo>

          <LeftContainer 
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
        <LayerEditor layers={layers} setLayer={setLayers} />
      </S.Container>

      <canvas hidden ref={videoCanvasRef} width={1920} height={1080} />
      <video loop hidden ref={videoRef} width={960} height={540} src={videoUrl}></video>
    </>
  )
}

export default VideoEditor;