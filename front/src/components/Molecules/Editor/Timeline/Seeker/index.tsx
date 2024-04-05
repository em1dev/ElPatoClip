import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles';
import { pixelsToSeconds, scrubberOffset, secondsToPixels } from '../util';
import { useDrag } from '../../../../../hooks/useDrag';
import { MathUtils } from '../../../../../Utils/MathUtils';
import { useEditorState } from '../../../../../store/EditorState/useEditorState';


export interface SeekerProps {
  containerRef: React.RefObject<HTMLDivElement | null>,
}

export const Seeker = ({ containerRef  }: SeekerProps) => {
  const seekTo = useEditorState(state => state.seekTo);
  const currentTime = useEditorState(state => state.videoMetadata.currentTime);
  const shouldAnimate = useEditorState(state => state.seekWithAnimation);

  const seekerRef = useRef<HTMLDivElement>(null);

  const onDrag = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect(); 
    const relativeX =  e.x - containerRect.x + container.scrollLeft - scrubberOffset.left;
    seekTo(pixelsToSeconds(relativeX));
  }, [containerRef, seekTo]);

  const isDragging = useDrag(seekerRef, onDrag);

  useEffect(() => {
    const seeker = seekerRef.current;
    if (!seeker) return;
    const pixelTime = secondsToPixels(currentTime);
    const seekerPosition = pixelTime + scrubberOffset.left;
    seeker.style.left = `${seekerPosition}px`;
    seeker.dataset.time = MathUtils.secondsToReadableText(currentTime, true);
  }, [currentTime]);

  useEffect(() => {
    const seeker = seekerRef.current;
    if (!seeker) return;
    seeker.dataset.dragging = isDragging.toString();
  }, [isDragging]);

  const replacementOffset = currentTime < 1 ? -20 : undefined;

  return (
    <S.Seeker 
      $replaceHeadLeftOffset={replacementOffset}
      $animate={shouldAnimate}
      ref={seekerRef} />
  );
};