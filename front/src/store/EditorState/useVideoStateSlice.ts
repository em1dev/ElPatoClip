import { StateCreator } from 'zustand';
import { MathUtils } from '../../Utils/MathUtils';
import { VideoEditSlice } from './useEditStateSlice';

const SHORT_SKIP_IN_SECONDS = 3;

export interface VideoStateSlice {
  seekWithAnimation: boolean,
  setSeekWithAnimation: (value: boolean) => void,
  videoRef: React.RefObject<HTMLVideoElement> | null,
  setVideoRef: (value: React.RefObject<HTMLVideoElement>) => void,
  setVolume: (value: number) => void,
  setIsPlaying: (value: boolean) => void,
  isPlaying: boolean,
  isMuted: boolean,
  setIsMuted: (value: boolean) => void,
  volume: number,
  toggleVideoPlayback: () => void,
  setPlayback: (value: boolean) => void,

  animationTimeoutId: NodeJS.Timeout | null,
  setAnimationTimeoutId: (value: NodeJS.Timeout | null) => void,
  seekTo: (value: number, animate?: boolean) => void,
  seekToStart: () => void,
  seekToEnd: () => void,
  seekForward: () => void,
  seekBackwards: () => void,
}

export const useVideoStateSlice:StateCreator<
  VideoEditSlice & VideoStateSlice,
  [],
  [],
  VideoStateSlice
> = (set, get) => ({
  videoRef: null,
  setVideoRef: (value) => set(() => ({ videoRef: value })),
  seekWithAnimation: false,
  setSeekWithAnimation: (value) => set(() => ({ seekWithAnimation: value })),
  isMuted: false,
  setIsMuted: (value) => {
    const video = get().videoRef?.current;
    if (video && video.muted !== value) {
      video.muted = value;
    }

    set(() => ({ isMuted: value }));
  },
  volume: 1,
  setVolume: (value) => {
    const video = get().videoRef?.current;
    if (video && video.volume !== value) {
      video.volume = value;
    }

    if (value === 0) {
      set(() => ({ isMuted: true }));
    }

    set(() => ({ volume: value }));
  },
  setIsPlaying: (value) => set(() => ({ isPlaying: value })),
  isPlaying: false,
  toggleVideoPlayback: () => {
    const video = get().videoRef?.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      return;
    }
    video.pause();
  },
  setPlayback: (value) => {
    const video = get().videoRef?.current;
    if (!video) return;
    value ? video.play() : video.pause();
  },
  animationTimeoutId: null,
  setAnimationTimeoutId: (value) => set(() => ({ animationTimeoutId: value })),
  seekTo: (value, animate = false) => {
    const { timeSlice, videoRef, animationTimeoutId, setSeekWithAnimation, setAnimationTimeoutId } = get();
    const video = videoRef?.current;

    if (!video) return;

    video.currentTime = (
      MathUtils.clamp(
        Math.min(value, video.duration - 0.1),
        timeSlice.startTime,
        timeSlice.endTime
      )
    );

    if (!animate) return;

    if (animationTimeoutId) {
      clearInterval(animationTimeoutId);
    }

    setSeekWithAnimation(true);

    const timeoutId = setTimeout(() => {
      setSeekWithAnimation(false);
      setAnimationTimeoutId(null);
    }, 300);

    setAnimationTimeoutId(timeoutId);
  },
  seekBackwards: () => {
    const { videoRef, seekTo } = get();
    const video = videoRef?.current;
    if (!video) return;

    seekTo(video.currentTime - SHORT_SKIP_IN_SECONDS, true);
  },
  seekForward: () => {
    const { videoRef, seekTo } = get();
    const video = videoRef?.current;
    if (!video) return;

    seekTo(video.currentTime + SHORT_SKIP_IN_SECONDS, true);
  },
  seekToEnd: () => {
    const { videoRef, seekTo } = get();
    const video = videoRef?.current;
    if (!video) return;

    seekTo(video.duration, true);
  },
  seekToStart: () => {
    get().seekTo(0, true);
  },
});