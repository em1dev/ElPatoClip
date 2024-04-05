import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as S from './styles';
import { MIN_VIDEO_LENGTH, layerOffset, pixelsToSeconds, scrubberOffset, secondsToPixels } from './util';
import { Seeker } from './Seeker';
import { CropHandle } from './CropHandle';
import { MathUtils } from '../../../../Utils/MathUtils';
import { useDrag } from '../../../../hooks/useDrag';
import { useEventListener } from '../../../../hooks/useEventListener';
import { Point } from '../../../../types';
import { useEditorState } from '../../../../store/EditorState/useEditorState';

const TimerLabelBlock = (label: string) => (
  <Fragment key={label}>
    <S.Spacer />
    <S.Spacer />
    <S.Spacer />
    <S.Spacer />
    <S.TimeLabel>{label}</S.TimeLabel>
  </Fragment>
);


export const Timeline = () => {
  const { endTime, startTime } = useEditorState(state => state.timeSlice);
  const setTimeSlice = useEditorState(state => state.setTimeSlice);
  const totalDuration = useEditorState(state => state.videoMetadata.totalTime);
  const seekTo = useEditorState(state => state.seekTo);

  const layerHandleRef = useRef<HTMLDivElement>(null);
  const playbackLineContainerRef = useRef<HTMLDivElement>(null);
  const layerContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const amountOfTimeBlocks = Math.ceil(totalDuration / 10);

  const timeBlock:Array<React.ReactNode> = [];
  for (let i = 0; i < amountOfTimeBlocks; i++) {
    timeBlock.push(TimerLabelBlock(MathUtils.secondsToReadableText((i + 1) * 10)));
  }

  const timelineWidthInPx = useMemo(() => {
    if (isNaN(totalDuration)) return 100;
    return secondsToPixels(totalDuration) + scrubberOffset.right;
  }, [totalDuration]);

  useEffect(() => {
    if (!layerContainerRef.current) return;
    if (!playbackLineContainerRef.current) return;
    const width = secondsToPixels(endTime - startTime) + layerOffset.left;
    const left = secondsToPixels(startTime);
    layerContainerRef.current.style.width = `${width}px`;
    layerContainerRef.current.style.left = `${left}px`;

    playbackLineContainerRef.current.style.width = `${width}px`;
    playbackLineContainerRef.current.style.left = `${left}px`;
  }, [startTime, endTime]);

  const onLeftCropHandle = useCallback((value: number) => {
    const newStartTime = pixelsToSeconds(value - 33);
    const timeDiff = MathUtils.clamp(endTime - newStartTime, MIN_VIDEO_LENGTH, totalDuration);
    setTimeSlice({
      endTime: endTime,
      startTime: Math.max(endTime - timeDiff, 0)
    });
  }, [setTimeSlice, endTime, totalDuration]);

  const onRightCropHandle = useCallback((value: number) => {
    const newEndTime = pixelsToSeconds(value - 33);
    const timeDiff = MathUtils.clamp(newEndTime - startTime, MIN_VIDEO_LENGTH, totalDuration);
    setTimeSlice({
      startTime: startTime,
      endTime: Math.min(startTime + timeDiff, totalDuration)
    });
  }, [startTime, setTimeSlice, totalDuration]);

  const [layerHandleDragOffset, setLayerHandleDragOffset] = useState<Point>({ x: 0, y:0 });

  const onLayerHandleDrag = useCallback((e: MouseEvent) => {
    const diffPosition = e.x - layerHandleDragOffset.x;
    const secondsToMove = pixelsToSeconds(diffPosition);
    const newCropTime = {
      startTime,
      endTime
    };
    const cropDuration = endTime - startTime;

    if (secondsToMove < 0) {
      newCropTime.startTime = Math.max(startTime + secondsToMove, 0);
      newCropTime.endTime = newCropTime.startTime + cropDuration;
    }

    if (secondsToMove > 0) {
      newCropTime.endTime = Math.min(endTime + secondsToMove, totalDuration);
      newCropTime.startTime = newCropTime.endTime - cropDuration;
    }
    setLayerHandleDragOffset({ x: e.x, y: e.y });
    setTimeSlice(newCropTime);
  }, [startTime, endTime, layerHandleDragOffset, totalDuration, setTimeSlice]);

  const onLayerHandleMouseDown = useCallback((e: MouseEvent) => {
    setLayerHandleDragOffset({
      x: e.x,
      y: e.y
    });
  }, []);

  useDrag(layerHandleRef, onLayerHandleDrag, onLayerHandleMouseDown);

  useEventListener<HTMLDivElement, MouseEvent>(playbackLineContainerRef, 'mousedown', (e) => {
    const newTime = startTime + pixelsToSeconds(e.offsetX);
    seekTo(newTime);
  });

  return (
    <S.Container ref={containerRef}>
      <Seeker containerRef={containerRef} />

      <S.PlaybackLineContainer width={timelineWidthInPx}>
        <S.PlaybackLine ref={playbackLineContainerRef}>
          <S.Layer />
        </S.PlaybackLine>
      </S.PlaybackLineContainer>

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
  );
};