import { useRef, MutableRefObject, useEffect, useState } from 'react';
import * as S from './styles';
import { Point, Source } from '../../types';
import { useEventListener } from '../../hooks';
import { MathUtils } from '../Utils/MathUtils';

export interface InputCanvasProps {
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  videoResolution?: { width: number, height: number },
  src?: Source,
  output: Source,
  borderColor: string,
  onOutputChange: (output: Source) => void,
  toggleVideoPlayback: () => void,
  renderVideo?: boolean
}

const InputCanvas = ({
  onOutputChange,
  output,
  src,
  borderColor,
  videoRef,
  videoResolution = { width: 1920, height: 1080},
  toggleVideoPlayback,
  renderVideo
}: InputCanvasProps) => {
  const [interactiveMode, setInteractionMode] = useState<'edit' | 'drag' | 'resize'>('edit');
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [clickedOffsetToOrigin, setClickedOffsetToOrigin] = useState<Point | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDrawFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    const onFrame = () => {
      onDrawFnRef.current();
      requestAnimationFrame(onFrame);
    }
    onFrame();
  }, []);

  useEventListener<HTMLCanvasElement, MouseEvent>(canvasRef, 'mousedown', (e) => {
    setHasMoved(false);
    if (!videoRef.current) return;
    if (!canvasRef.current) return;
    const offsetClick = { x: e.offsetX, y: e.offsetY };
    const clicked = MathUtils.convertToCanvasPoint(videoResolution, offsetClick, canvasRef.current);
    const clickedOnLayer = MathUtils.isInsideRect(clicked, output.rect);

    if (clickedOnLayer) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const relativePoint = MathUtils.convertToCanvasPoint(videoResolution, 
        { x: e.x - canvasRect.left, y: e.y - canvasRect.top },
      canvasRef.current);
      setClickedOffsetToOrigin({
        x: relativePoint.x - output.rect.x,
        y: relativePoint.y - output.rect.y
      });
      return;
    }
  });

  useEventListener<HTMLElement, MouseEvent>(document.body, 'mousemove', (e) => {
    setHasMoved(true);
    if (!canvasRef.current) return;
    if (!clickedOffsetToOrigin) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    let currentPosition = { ...output.rect };

    const relativeMousePosition = {
      x: e.x - canvasRect.left,
      y: e.y - canvasRect.top
    };

    const mouseAtPositionOnCanvas = MathUtils.convertToCanvasPoint(videoResolution, relativeMousePosition, canvasRef.current);
    mouseAtPositionOnCanvas.x -= clickedOffsetToOrigin.x;
    mouseAtPositionOnCanvas.y -= clickedOffsetToOrigin.y;

    currentPosition.x = mouseAtPositionOnCanvas.x;
    currentPosition.y = mouseAtPositionOnCanvas.y;

    currentPosition = {
      ...currentPosition,
      x: MathUtils.clamp(currentPosition.x, 0, videoResolution.width - currentPosition.width),
      y: MathUtils.clamp(currentPosition.y, 0, videoResolution.height - currentPosition.height),
    }

    onOutputChange({
      rect: currentPosition
    });
  })

  useEventListener(document.body, 'mouseup', () => {
    setHasMoved(false);
    setClickedOffsetToOrigin(null);
    if (hasMoved) return;
    toggleVideoPlayback();
  });

  useEffect(() => {
    onDrawFnRef.current = () => {
      const ctx = canvasRef.current?.getContext('2d');
      const videoEl = videoRef.current;

      if (
        !ctx ||
        !canvasRef.current ||
        !videoEl
        ) return;

      ctx.clearRect(0,0, videoResolution.width, videoResolution.height);
      //TODO refactor
      if (renderVideo) {
        ctx.drawImage(videoEl, 0,0, videoResolution.width,  videoResolution.height);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0,0, videoResolution.width, videoResolution.height);
        ctx.drawImage(videoEl,
          output.rect.x,
          output.rect.y,
          output.rect.width,
          output.rect.height,
          output.rect.x,
          output.rect.y,
          output.rect.width,
          output.rect.height
        );
      } else {
        if (!src) return;
        ctx.drawImage(
          videoEl,
          src.rect.x,
          src.rect.y,
          src.rect.width,
          src.rect.height,
          output.rect.x,
          output.rect.y,
          output.rect.width,
          output.rect.height,

        );
      }

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(
        output.rect.x,
        output.rect.y,
        output.rect.width,
        output.rect.height
      );
    };

    return () => {
      onDrawFnRef.current = () => {};
    }

  }, [videoRef, videoResolution, renderVideo, borderColor, output, src]);

  return (
    <S.InputCanvas 
      ref={canvasRef} 
      width={videoResolution.width}
      height={videoResolution.height}
    />
  )
}

export default InputCanvas;