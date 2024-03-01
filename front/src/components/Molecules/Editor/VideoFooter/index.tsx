import { VideoControls, VideoControlsProps } from "../VideoControls"

export interface VideoFooterProps extends VideoControlsProps {

}

export const VideoFooter = ({
  isPlaying,
  onBackwardClicked,
  onForwardClicked,
  onToEndClicked,
  onToStartClicked,
  setIsPlaying,
}: VideoFooterProps) => (
  <div>
    <VideoControls 
      isPlaying={isPlaying} 
      onBackwardClicked={onBackwardClicked}
      onForwardClicked={onForwardClicked}
      onToEndClicked={onToEndClicked}
      onToStartClicked={onToStartClicked}
      setIsPlaying={setIsPlaying}
    />
  </div>
);