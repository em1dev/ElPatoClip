import { useCallback, useEffect, useRef } from 'react';

export const useOnIntersection = <T extends HTMLElement>(onIntersection: () => void) => {
  const intersectionRef = useRef<IntersectionObserver | null>(null);
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onIntersection);

  const setRef = useCallback((node: T) => {
    if (ref.current) {
      // disconnect
      intersectionRef.current?.disconnect();
    }

    if (node) {
      // add events
      intersectionRef.current?.observe(node);
    }

    ref.current = node;
  }, []);

  useEffect(() => {
    callbackRef.current = onIntersection;
  }, [onIntersection]);

  useEffect(() => {
    intersectionRef.current = new IntersectionObserver((e) => {
      if (!e.at(0)?.isIntersecting) return;
      callbackRef.current();
    });
  }, []);

  return setRef;
};