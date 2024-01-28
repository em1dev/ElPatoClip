import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MathUtils } from '../../../Utils/MathUtils';
import * as S from './styles';
import { MIN_VIDEO_LENGTH, layerOffset, pixelsToSeconds, scruberOffset, secondsToPixels } from './util';
import { Seeker } from './Seeker';
import { Point, TimeSlice } from '../../../types';
import { CropHandle } from './CropHandle';
import { useDrag } from '../../../hooks/useDrag';


const TimerLabelBlock = (label: string) => (
  <Fragment key={label}>
    <S.Spacer />
    <S.Spacer />
    <S.Spacer />
    <S.Spacer />
    <S.TimeLabel>{label}</S.TimeLabel>
  </Fragment>
);

export interface TimelineProps {
  cropTime: TimeSlice,
  setCropTime: (value: TimeSlice) => void,
  totalDuration: number,
  currentTime: number,
  seekTo: (to: number) => void,
}

export const Timeline = ({
  currentTime,
  seekTo,
  cropTime,
  setCropTime,
  totalDuration = 1000,
}: TimelineProps) => {
  const layerHandleRef = useRef<HTMLDivElement>(null);
  const layerContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const amountOfTimeBlocks = Math.ceil(totalDuration / 10);

  const timeBlock:Array<React.ReactNode> = [];
  for (let i = 0; i < amountOfTimeBlocks; i++) {
    timeBlock.push(TimerLabelBlock(MathUtils.secondsToReadableText((i + 1) * 10)));
  }

  const timelineWidthInPx = useMemo(() => {
    if (isNaN(totalDuration)) return 100;
    return secondsToPixels(totalDuration) + scruberOffset.right;
  }, [totalDuration])

  useEffect(() => {
    if (!layerContainerRef.current) return;
    const width = secondsToPixels(cropTime.endTime - cropTime.startTime) + layerOffset.left;
    const left = secondsToPixels(cropTime.startTime);
    layerContainerRef.current.style.width = `${width}px`;
    layerContainerRef.current.style.left = `${left}px`;
  }, [cropTime]);

  const onLeftCropHandle = useCallback((value: number) => {
    const startTime = pixelsToSeconds(value - 33);
    const timeDiff = MathUtils.clamp(cropTime.endTime - startTime, MIN_VIDEO_LENGTH, totalDuration);
    setCropTime({
      endTime: cropTime.endTime,
      startTime: Math.max(cropTime.endTime - timeDiff, 0)
    })
  }, [setCropTime, cropTime, totalDuration]);

  const onRightCropHandle = useCallback((value: number) => {
    const endTime = pixelsToSeconds(value - 33);
    const timeDiff = MathUtils.clamp(endTime - cropTime.startTime, MIN_VIDEO_LENGTH, totalDuration);
    setCropTime({
      startTime: cropTime.startTime,
      endTime: Math.min(cropTime.startTime + timeDiff, totalDuration)
    })
  }, [cropTime, setCropTime, totalDuration]);

  const [layerHandleDragOffset, setLayerHandleDragOffset] = useState<Point>({ x: 0, y:0 });

  const onLayerHandleDrag = useCallback((e: MouseEvent) => {
    const diffPosition = e.x - layerHandleDragOffset.x;
    const secondsToMove = pixelsToSeconds(diffPosition);
    const newCropTime = {
      ...cropTime
    };
    const cropDuration = cropTime.endTime - cropTime.startTime;

    if (secondsToMove < 0) {
      newCropTime.startTime = Math.max(cropTime.startTime + secondsToMove, 0);
      newCropTime.endTime = newCropTime.startTime + cropDuration;
    }

    if (secondsToMove > 0) {
      newCropTime.endTime = Math.min(cropTime.endTime + secondsToMove, totalDuration);
      newCropTime.startTime = newCropTime.endTime - cropDuration;
    }
    setLayerHandleDragOffset({ x: e.x, y: e.y });
    setCropTime(newCropTime);
  }, [cropTime, layerHandleDragOffset, totalDuration, setCropTime]);

  const onLayerHandleMouseDown = useCallback((e: MouseEvent) => {
    setLayerHandleDragOffset({
      x: e.x,
      y: e.y
    })
  }, []);

  useDrag(layerHandleRef, onLayerHandleDrag, onLayerHandleMouseDown);

  return (
    <S.Container ref={containerRef}>
      <Seeker containerRef={containerRef} currentTime={currentTime} seekTo={seekTo} />
      <S.DurationContainer>
        <S.TimeLabel>00:00</S.TimeLabel>
        {timeBlock}
      </S.DurationContainer>

      <S.TimelineContainer width={timelineWidthInPx}>

        <S.LayerContainer ref={layerContainerRef}>
          <CropHandle containerRef={containerRef} onMove={onLeftCropHandle} />
            <S.Layer ref={layerHandleRef} />
          <CropHandle containerRef={containerRef} onMove={onRightCropHandle} />
        </S.LayerContainer>

      </S.TimelineContainer>
    </S.Container>
  )
};