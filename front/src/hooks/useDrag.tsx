import { useCallback, useState } from "react";
import { useEventListener } from "./useEventListener";

export const useDrag = <T extends HTMLElement>(
  el: React.RefObject<T | null>,
  onDrag?: (e:MouseEvent, el: T) => void,
  onMouseDown?: (e: MouseEvent, el:T) => void,
  onMouseUp?: (e: MouseEvent, el:T) => void
) => {
  const [isDraggin, setIsDraggin] = useState<boolean>(false);

  useEventListener<T, MouseEvent>(el, 'mousedown', useCallback((e) => {
    setIsDraggin(true);
    if (!el.current) return;
    onMouseDown && onMouseDown(e, el.current);
  }, [el, onMouseDown]));

  useEventListener<Window, MouseEvent>(window, 'mousemove', useCallback((e) => {
    if (!isDraggin) return;
    if (!el.current) return;
    e.preventDefault();
    onDrag && onDrag(e, el.current);
  }, [el, isDraggin, onDrag]));

  useEventListener<Window, MouseEvent>(window, 'mouseup', useCallback((e) => {
    setIsDraggin(false);
    if (!el.current) return;
    onMouseUp && onMouseUp(e, el.current);
  }, [el, onMouseUp]));
};