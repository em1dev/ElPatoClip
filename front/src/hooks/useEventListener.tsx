import { MutableRefObject, useEffect, useRef } from "react";

export const useEventListener = <T extends EventTarget, E extends Event>(
  elRef: MutableRefObject<T | null> | T,
  event: keyof HTMLElementEventMap, handler: (e:E) => void) => {
  const hanlderRef = useRef(handler);

  useEffect(() => {
    hanlderRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const isEl = (
      elRef instanceof HTMLElement ||
      elRef instanceof Window
    );

    const el = isEl ? elRef as T : (elRef as MutableRefObject<T | null>).current;
    const handlerProxy = (e:Event) => hanlderRef.current(e as E);
    el?.addEventListener(event, handlerProxy);

    return () => {
      el?.removeEventListener(event, handlerProxy);
    }
  }, [elRef, event]);
}