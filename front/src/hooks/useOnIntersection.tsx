import { RefObject, useEffect, useRef } from "react"

export const useOnIntersection = <T extends HTMLElement>(el: RefObject<T>, onIntersection: () => void) => {
  const callbackRef = useRef(onIntersection);

  useEffect(() => {
    callbackRef.current = onIntersection;
  }, [onIntersection]);

  useEffect(() => {
    const inter = new IntersectionObserver((e) => {
      if (!e.at(0)?.isIntersecting) return;
      callbackRef.current();
    })

    if (!el.current) return;
    inter.observe(el.current);
    return () => {
      inter.disconnect();
    }
  }, [el])
}