import { useEffect, useRef } from 'react';

export const useRenderLoop = (fn: () => void) => {
  const callbackFn = useRef(fn);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    callbackFn.current = fn;
  }, [fn]);

  useEffect(() => {
    const onFrame = () => {
      callbackFn.current();
      animationFrameIdRef.current = window.requestAnimationFrame(onFrame);
    };
    onFrame();

    return () => {
      if (!animationFrameIdRef.current) return;
      window.cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);
};