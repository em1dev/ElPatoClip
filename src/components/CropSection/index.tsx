import { MutableRefObject, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { CropOptions } from '../../types';

export interface CropSectionProps<T extends HTMLElement | null> {
  setDetails: React.Dispatch<React.SetStateAction<CropOptions>>,
  details: CropDetails,
  limitToEl: MutableRefObject<T>,
}

type InteractionMode = 'move' | 'resize-top-left' | 'resize-top-right' | 'resize-bot-left' | 'resize-bot-right' | null;


const CropSection = <T extends HTMLElement | null>({ setDetails, details, limitToEl }: CropSectionProps<T>) => {
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() =>  {
    const el = ref.current;

    if (el) {
      el.style.top = `${details.y}px`;
      el.style.left = `${details.x}px`;
      el.style.height = `${details.height}px`;
      el.style.width = `${details.width}px`;
    }

    const onMouseDown = (e:MouseEvent) => {
      const resizeOffset = 100;
      const pos = { x: e.offsetX, y: e.offsetY };

      if (isNearPoint(pos, details, resizeOffset)) {
        setInteractionMode('resize-top-left');
        return;
      }

      if (isNearPoint(pos, { x: details.x, y: details.y + details.height }, resizeOffset)) {
        setInteractionMode('resize-bot-left');
        return;
      }

      if (isNearPoint(pos, { x: details.x + details.width, y: details.y}, resizeOffset)) {
        setInteractionMode('resize-top-right');
        return;
      }

      if (isNearPoint(pos, { x: details.x + details.width, y: details.y + details.height}, resizeOffset)) {
        setInteractionMode('resize-bot-right');
        return;
      }

      setInteractionMode('move');
    }

    const onMouseUp = () => {
      setInteractionMode(null);
    }

    el?.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      el?.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }, [details]);

  useEffect(() => {
    const onResizeAction = (e:MouseEvent) => {
      if (!e.target) return;
      if (!limitToEl.current) return;
      console.log('resizing???');

      const newValues = {
        ...details
      };
      if (interactionMode === 'resize-bot-left' ||
          interactionMode === 'resize-bot-right') {
          newValues.height += e.movementY;
      }

      if (interactionMode === 'resize-top-left' ||
          interactionMode === 'resize-top-right') {
          newValues.y += e.movementY;
          newValues.height -= e.movementY;
      }

      if (interactionMode === 'resize-top-left' ||
          interactionMode === 'resize-bot-left') {
          newValues.x += e.movementX;
          newValues.x -= e.movementX;
      }

      if (interactionMode === 'resize-top-right' ||
          interactionMode === 'resize-bot-right') {
          newValues.width += e.movementX;
      }

      const el = limitToEl.current.getBoundingClientRect();
      const limits = {
        topLeft: { 
          x: el.left,
          y: el.top
        },
        bottomRight: { 
          x: el.left + el.width,
          y: el.top + el.height
        }
      }

      setDetails({
        x: clamp(newValues.x, limits.topLeft.x, limits.bottomRight.x - details.width),
        y: clamp(newValues.y, limits.topLeft.y, limits.bottomRight.y - details.height),
        height: newValues.height,
        width: newValues.width,
      });
    }

    const onDragAction = (e:MouseEvent) => {
      if (!e.target) return;
      if (!limitToEl.current) return;

      const el = limitToEl.current.getBoundingClientRect();
      const limits = {
        topLeft: { 
          x: el.left,
          y: el.top
        },
        bottomRight: { 
          x: el.left + el.width,
          y: el.top + el.height
        }
      }

      setDetails((prev) => ({
        x: clamp(prev.x + e.movementX,limits.topLeft.x, limits.bottomRight.x - details.width),
        y: clamp(prev.y + e.movementY, limits.topLeft.y, limits.bottomRight.y - details.height),
        height: prev.height,
        width: prev.width
      }));
    }



    const onMouseMove = (e:MouseEvent) => {
      switch(interactionMode) {
        case 'move':
          onDragAction(e);
          break;
        case 'resize-bot-left':
        case 'resize-bot-right':
        case 'resize-top-right':
        case 'resize-top-left':
          onResizeAction(e);
          break;
      }
    }

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, [setDetails, limitToEl, details, interactionMode]);

  return (
    <S.CropSection ref={ref} />
  );
}

export default CropSection;