import { useCallback, useEffect, useRef, useState } from 'react';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { TimeSlice } from '../../../types';
import { MathUtils } from '../../../Utils/MathUtils';

const SHORT_SKIP_IN_SECONDS = 3;

export const useVideo = (
  videoRef: React.RefObject<HTMLVideoElement>,
  timeSlice: TimeSlice,
  setSeekWithAnimation?: (value: boolean) => void,
) => {
  const animationTimeoutId = useRef<null | NodeJS.Timeout>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volumeInternal, setVolumeInternal] = useState<number>(1);

  const [videoMetadata, setVideoMetadata] = useState<{
    currentTime: number,
    totalTime: number
  }>({ currentTime: 0, totalTime: 0});

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const time = video.currentTime;
    video.currentTime = MathUtils.clamp(time, timeSlice.startTime, timeSlice.endTime);
  }, [timeSlice, videoRef]);

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (!video.paused && video.currentTime >= timeSlice.endTime) {
      video.currentTime = timeSlice.startTime;
    }

    setVideoMetadata({
      currentTime: videoRef.current.currentTime,
      totalTime: videoRef.current.duration
    });
  }, [videoRef, timeSlice]));

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const onPlay = () => { setIsPlaying(true); };
    const onStop = () => { setIsPlaying(false); };
    const onVolumeChange = () => { 
      setIsMuted(!!videoRef.current?.muted);
      setVolumeInternal(videoRef.current?.volume ?? 1);
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
    };
  }, [videoRef]);

  const setPlayback = useCallback((value: boolean) => {
    if (!videoRef.current) return;
    value ? videoRef.current.play() : videoRef.current.pause();
  }, [videoRef]);

  const toggleVideoPlayback = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      return;
    }
    videoRef.current.pause();
  }, [videoRef]);

  const seekTo = useCallback((value: number, animate: boolean = false) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = (
      MathUtils.clamp(Math.min(value,
        videoRef.current.duration - 0.1),
      timeSlice.startTime, timeSlice.endTime)
    );

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

  }, [videoRef, setSeekWithAnimation, timeSlice]);

  const seekForward = useCallback(() => {
    if (!videoRef.current) return;

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
    isMuted,
    videoMetadata,
    volume: volumeInternal,
  };
}; 