import { useCallback, useEffect, useRef, useState } from "react";

const SHORT_SKIP_IN_SECONDS = 3;

export const useVideo = (
  videoRef: React.RefObject<HTMLVideoElement>,
  setSeekWithAnimation?: (value: boolean) => void
  ) => {
  const animationTimeoutId = useRef<null | number>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const onPlay = () => { setIsPlaying(true); };
    const onStop = () => { setIsPlaying(false); };
    const onVolumeChange = () => { 
      setIsMuted(!!videoRef.current?.muted);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('ended', onStop);
    video.addEventListener('pause', onStop);
    video.addEventListener('volumechange', onVolumeChange);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('ended', onStop);
      video.removeEventListener('pause', onStop);
      video.removeEventListener('volumechange', onVolumeChange);
    }
  }, [videoRef]);

  const setPlayback = useCallback((value: boolean) => {
    if (!videoRef.current) return;
    value ? videoRef.current.play() : videoRef.current.pause();
  }, [videoRef]);

  const toggleVideoPlayback = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play()
      return;
    }
    videoRef.current.pause();
  }, [videoRef]);

  const seekTo = useCallback((value: number, animate: boolean = false) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = Math.min(value, videoRef.current.duration - 0.1);

    if (!animate) return;

    if (animationTimeoutId.current) {
      clearInterval(animationTimeoutId.current);
    }
    setSeekWithAnimation && setSeekWithAnimation(true);
    const timeoutId = setTimeout(() => {
      setSeekWithAnimation && setSeekWithAnimation(false);
      animationTimeoutId.current = null;
    }, 300);
    animationTimeoutId.current = timeoutId;

  }, [videoRef, setSeekWithAnimation]);

  const seekForward = useCallback(() => {
    if (!videoRef.current) return;

    console.log(videoRef.current.currentTime);
    seekTo(videoRef.current.currentTime + SHORT_SKIP_IN_SECONDS, true);
  }, [seekTo, videoRef]);

  const seekBackwards = useCallback(() => {
    if (!videoRef.current) return;

    seekTo(videoRef.current.currentTime - SHORT_SKIP_IN_SECONDS, true);
  }, [videoRef, seekTo]);

  const seekToEnd = useCallback(() => {
    if (!videoRef.current) return;

    seekTo(videoRef.current.duration, true);
  }, [videoRef, seekTo]);

  const seekToStart = useCallback(() => {
    if (!videoRef.current) return;

    seekTo(0, true);
  }, [videoRef, seekTo]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  }, [videoRef]);

  const setVolume = useCallback((value: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value;
  }, [videoRef]);

  return {
    toggleVideoPlayback,
    seekTo,
    seekForward,
    seekBackwards,
    seekToEnd,
    seekToStart,
    toggleMute,
    setVolume,
    setPlayback,
    isPlaying,
    setIsPlaying,
    isMuted
  };
}; 