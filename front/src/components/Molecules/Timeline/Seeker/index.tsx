import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles';
import { pixelsToSeconds, scruberOffset, secondsToPixels } from '../util';
import { useDrag } from '../../../../hooks/useDrag';

export interface SeekerProps {
  containerRef: React.RefObject<HTMLDivElement | null>,
  seekTo: (value: number) => void,
  currentTime: number,
  shouldAnimate: boolean,
}

export const Seeker = ({ containerRef, seekTo, currentTime, shouldAnimate }: SeekerProps) => {
  const seekerRef = useRef<HTMLDivElement>(null);

  const onDrag = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect(); 
    const relativeX =  e.x - containerRect.x + container.scrollLeft - scruberOffset.left;
    seekTo(pixelsToSeconds(relativeX));
  }, [containerRef, seekTo])

  useDrag(seekerRef, onDrag);

  useEffect(() => {
    const seeker = seekerRef.current;
    if (!seeker) return;
    const pixelTime = secondsToPixels(currentTime);
    const seekerPosition = pixelTime + scruberOffset.left;
    seeker.style.left = `${seekerPosition}px`;
  }, [currentTime]);

  return (
    <S.Seeker withAnimation={shouldAnimate} ref={seekerRef} />
  )
};