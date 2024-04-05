import * as S from './styles';
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { VideoCanvas } from '../../../Molecules/Editor/VideoCanvas';
import { Layer, Source } from '../../../../types';
import useResizeObserver from '@react-hook/resize-observer';
import { useEditorState } from '../../../../store/EditorState/useEditorState';

export interface ContentProps {
  videoCanvasRef: RefObject<HTMLCanvasElement>,
}

export const Content = ({
  videoCanvasRef,
}: ContentProps) => {
  const visibleCanvases = useEditorState(state => state.selectedVisibleCanvas);
  const layers = useEditorState(state => state.layers);
  const setLayers = useEditorState(state => state.setLayers);

  const containerRef = useRef<HTMLDivElement>(null);
  const portraitContainerRef = useRef<HTMLDivElement>(null);
  const landscapeContainerRef = useRef<HTMLDivElement>(null);

  const onInputChange = (id: number, src: Source) => {
    setLayers( layers.map(i => i.id !== id ? i : {
      ...i,
      input: src
    } satisfies Layer)
    );
  };

  const onOutputChange = (id: number, output: Source) => {
    setLayers( layers.map(i => i.id !== id ? i : {
      ...i,
      output: output
    } satisfies Layer)
    );
  };



  const handleResize = useCallback(() =>  {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    // if only landscape is visible
    if (landscapeContainerRef.current && !portraitContainerRef.current) {
      const calculatedHeight = ((width / 16) * 9);
      if (calculatedHeight > height) {
        landscapeContainerRef.current.style.height = height + 'px';
        landscapeContainerRef.current.style.width = '';
        return;
      }

      landscapeContainerRef.current.style.height = '';
      landscapeContainerRef.current.style.width = width + 'px';
      return;
    }

    // if both are visible
    if (!portraitContainerRef.current || !landscapeContainerRef.current ) return;
    // assume portrait is always at 100%
    const c1Width = portraitContainerRef.current.getBoundingClientRect().width;
    const restingWidth = (width - c1Width);
    const heightWithAspect = Math.min(((restingWidth / 16) * 9), height);
    const widthWithAspect = (heightWithAspect / 9) * 16;

    if (heightWithAspect < height && widthWithAspect < width) {
      landscapeContainerRef.current.style.height = heightWithAspect.toString() + 'px';
      landscapeContainerRef.current.style.width = '';
      return;
    }

    const widthWithAspect2 = Math.min(widthWithAspect, width);
    landscapeContainerRef.current.style.height = '';
    landscapeContainerRef.current.style.width = widthWithAspect2.toString() + 'px';
  }, []);

  useEffect(() => {
    handleResize();
  }, [visibleCanvases, handleResize]);

  useLayoutEffect(handleResize, [handleResize]);
  useResizeObserver(containerRef, handleResize);

  return (
    <S.Container ref={containerRef}>

      { visibleCanvases !== 'portrait' && (
        <S.Landscape ref={landscapeContainerRef}>
          <VideoCanvas
            renderVideo
            direction='landscape'
            onOutputChange={onInputChange}
            videoRef={videoCanvasRef}
            withPadding
            type='input'
          />
        </S.Landscape>
      )}

      { visibleCanvases !== 'landscape' && (
        <S.Portrait ref={portraitContainerRef}>
          <VideoCanvas
            direction='portrait'
            onOutputChange={onOutputChange}
            videoRef={videoCanvasRef}
            withPadding
            type='output'
          />
        </S.Portrait>
      )}
    </S.Container>
  );

};