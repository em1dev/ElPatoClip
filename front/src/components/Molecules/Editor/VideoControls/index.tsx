import { ButtonIcon } from '../../../Atoms/ButtonIcon';
import * as S from './styles';

export interface VideoControlsProps {
  isPlaying: boolean,
  setIsPlaying: (value: boolean) => void,
  onToStartClicked: () => void,
  onToEndClicked: () => void,
  onForwardClicked: () => void,
  onBackwardClicked: () => void,
}

export const VideoControls = ({
  isPlaying,
  setIsPlaying,
  onBackwardClicked,
  onForwardClicked,
  onToEndClicked,
  onToStartClicked
}: VideoControlsProps) => (
  <S.Container>
    <ButtonIcon onClick={onToStartClicked} alt="to start" iconName='MingcuteSkipPreviousFill.svg' />
    <ButtonIcon onClick={onBackwardClicked} alt="rewind" iconName='MingcuteFastRewindFill.svg' />
    {isPlaying ?
      <ButtonIcon onClick={() => setIsPlaying(false)} alt="pause video" iconName='MingcutePauseFill.svg' /> :
      <ButtonIcon onClick={() => setIsPlaying(true)} alt="play video" iconName='MingcutePlayFill.svg' />
    }
    <ButtonIcon onClick={onForwardClicked} alt="fordward" iconName='MingcuteFastForwardFill.svg' />
    <ButtonIcon onClick={onToEndClicked} alt="to end" iconName='MingcuteSkipForwardFill.svg' />
  </S.Container>
);