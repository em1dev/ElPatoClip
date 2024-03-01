import { Layer, Source, TimeSlice } from '../../../../types';
import { Timeline } from '../../../Molecules/Editor/Timeline';
import { VideoCanvas } from '../../../Molecules/Editor/VideoCanvas';
import { VideoFooter } from '../../../Molecules/Editor/VideoFooter';
import { VideoHeader } from '../../../Molecules/Editor/VideoHeader';
import { useVideo } from '../../../Pages/VideoEditorPage/useVideo';
import * as S from './styles';

export interface LeftContainerProps {
  onRenderClick: () => void,
  inputLayers: Array<Layer>,
  onInputChange: (layerId: number, output:Source) => void,
  videoCanvasRef: React.RefObject<HTMLCanvasElement>,
  setCropTime: (slice: TimeSlice) => void,
  cropTime: TimeSlice,
  video: ReturnType<typeof useVideo>,
  seekWithAnimation: boolean
}

export const LeftContainer = ({
  inputLayers,
  onInputChange,
  onRenderClick,
  videoCanvasRef,
  cropTime,
  setCropTime,
  video,
  seekWithAnimation
}: LeftContainerProps) => (
<S.LandscapeVideoContainer>
  <VideoHeader
    onMuteToggle={video.toggleMute}
    isMuted={video.isMuted}
    onRenderClick={onRenderClick}
    currentTime={video.videoMetadata.currentTime}
    videoLength={video.videoMetadata.totalTime}
  />
  <VideoCanvas
    toggleVideoPlayback={video.toggleVideoPlayback}
    layers={inputLayers}
    onOutputChange={onInputChange}
    videoRef={videoCanvasRef}
    renderVideo
  />
  <VideoFooter 
    isPlaying={video.isPlaying}
    setIsPlaying={video.setPlayback}
    onBackwardClicked={video.seekBackwards}
    onForwardClicked={video.seekForward}
    onToEndClicked={video.seekToEnd}
    onToStartClicked={video.seekToStart}
  />
  <S.TimelineContainer>
    <Timeline 
      seekWithAnimation={seekWithAnimation}
      setCropTime={setCropTime}
      cropTime={cropTime}
      currentTime={video.videoMetadata.currentTime}
      totalDuration={video.videoMetadata.totalTime}
      seekTo={video.seekTo}
    />
  </S.TimelineContainer>
</S.LandscapeVideoContainer>
)