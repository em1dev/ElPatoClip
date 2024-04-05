import { useCallback, useEffect} from 'react';
import { useRenderLoop } from '../../../hooks/useRenderLoop';
import { MathUtils } from '../../../Utils/MathUtils';
import { useEditorState } from '../../../store/EditorState/useEditorState';


export const VideoEvents = () => {
  const videoRef = useEditorState(state => state.videoRef);
  const timeSlice = useEditorState(state => state.timeSlice);
  const setIsPlaying = useEditorState(state => state.setIsPlaying);
  const setIsMuted = useEditorState(state => state.setIsMuted);
  const setVolume = useEditorState(state => state.setVolume);
  const setCurrentTime = useEditorState(state => state.setVideoCurrentTime);
  const setVideoTotalTime = useEditorState(state => state.setVideoTotalTime);
  const setTimeSlice = useEditorState(state => state.setTimeSlice);

  useRenderLoop(useCallback(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    if (!video.paused && video.currentTime >= timeSlice.endTime) {
      video.currentTime = timeSlice.startTime;
    }

    const currentTime = MathUtils.nanAsZero(video.currentTime);
    setCurrentTime(currentTime);
  }, [videoRef, setCurrentTime, timeSlice]));

  useEffect(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;
    const onPlay = () => { setIsPlaying(true); };
    const onStop = () => { setIsPlaying(false); };
    const onVolumeChange = () => { 
      setIsMuted(!!videoRef.current?.muted);
      setVolume(videoRef.current?.volume ?? 1);
    };

    const onDurationChanged = (e: Event) => {
      const duration = (e.target as HTMLVideoElement).duration;
      setVideoTotalTime(duration);
    };

    video.addEventListener('durationchange', onDurationChanged);
    video.addEventListener('play', onPlay);
    video.addEventListener('ended', onStop);
    video.addEventListener('pause', onStop);
    video.addEventListener('volumechange', onVolumeChange);
    return () => {
      video.removeEventListener('durationchange', onDurationChanged);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('ended', onStop);
      video.removeEventListener('pause', onStop);
      video.removeEventListener('volumechange', onVolumeChange);
    };
  }, [videoRef, setIsPlaying, setIsMuted, setVolume, setTimeSlice, setVideoTotalTime]);

  return null;
};