import * as S from './styles';
import { ButtonIcon } from "../../../Atoms/ButtonIcon";
import { Timeline } from "../../../Molecules/Editor/Timeline";
import { VideoControls } from "../../../Molecules/Editor/VideoControls";
import { MathUtils } from '../../../../Utils/MathUtils';
import { useVideo } from '../../../Pages/VideoEditorPage/useVideo';
import { TimeSlice } from '../../../../types';

export interface FooterProps {
  seekWithAnimation: boolean,
  video: ReturnType<typeof useVideo>,
  cropTime: TimeSlice,
  setCropTime: (value: TimeSlice) => void
}

export const Footer = ({
  seekWithAnimation,
  video,
  cropTime,
  setCropTime
}: FooterProps) => (
  <S.Container>
    <div>
      <div>
        <S.CurrentTime>
          {MathUtils.secondsToReadableText(video.videoMetadata.currentTime, true)}
        </S.CurrentTime>
        <S.TotalDuration>
          / {MathUtils.secondsToReadableText(video.videoMetadata.totalTime, true)}
        </S.TotalDuration>
      </div>

      <VideoControls 
        isPlaying={video.isPlaying} 
        onBackwardClicked={video.seekBackwards}
        onForwardClicked={video.seekForward}
        onToEndClicked={video.seekToEnd}
        onToStartClicked={video.seekToStart}
        setIsPlaying={video.setPlayback}
      />
      <ButtonIcon 
        onClick={video.toggleMute} 
        alt="toggle mute"
        iconName={video.isMuted ? 'MingcuteVolumeMuteFill.svg' : 'MingcuteVolumeFill.svg'}
      />
    </div>

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

  </S.Container>
)