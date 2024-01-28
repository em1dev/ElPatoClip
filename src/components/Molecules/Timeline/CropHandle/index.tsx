import { RefObject, useCallback, useRef } from 'react';
import * as S from './styles';
import { useDrag } from '../../../../hooks/useDrag';

interface CropHandleProps {
  containerRef: RefObject<HTMLDivElement>,
  onMove: (position: number) => void,
}

export const CropHandle = ({
  containerRef,
  onMove
}: CropHandleProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  const onDrag = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    onMove(e.x - rect.left + containerRef.current.scrollLeft);
  }, [containerRef, onMove]);

  useDrag(elRef, onDrag);

  return <S.Container ref={elRef} />
};