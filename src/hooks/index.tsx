import { MutableRefObject, useEffect, useRef } from "react";

export const useEventListener = <T extends HTMLElement, E extends Event>(
  elRef: MutableRefObject<T | null> | T,
  event: keyof HTMLElementEventMap, handler: (e:E) => void) => {
  const hanlderRef = useRef(handler);

  useEffect(() => {
    hanlderRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const el = elRef instanceof HTMLElement ? elRef : elRef.current;
    const handlerProxy = (e:Event) => hanlderRef.current(e as E);
    el?.addEventListener(event, handlerProxy);

    return () => {
      el?.removeEventListener(event, handlerProxy);
    }
  }, [elRef, event]);
}