import { ButtonIcon } from "../../Atoms/ButtonIcon";
import { MathUtils } from "../../Utils/MathUtils";
import * as S from './styles';

export interface VideoHeaderProps {
  isPlaying: boolean,
  setIsPlaying: (value: boolean) => void,
  videoLength: number,
  currentTime: number
}

export const VideoHeader = ({
  isPlaying,
  setIsPlaying,
  currentTime,
  videoLength
}: VideoHeaderProps) => (
  <S.Container>
    <span>
      Pato crea un editor de video
    </span>

    <S.ButtonContainer>
      <ButtonIcon alt="to start" iconName='MingcuteSkipPreviousFill.svg' />
      <ButtonIcon alt="rewind" iconName='MingcuteFastRewindFill.svg' />
      {isPlaying ?
        <ButtonIcon onClick={() => setIsPlaying(false)} alt="pause video" iconName='MingcutePauseFill.svg' /> :
        <ButtonIcon onClick={() => setIsPlaying(true)} alt="play video" iconName='MingcutePlayFill.svg' />
      }
      <ButtonIcon alt="rewind" iconName='MingcuteFastForwardFill.svg' />
      <ButtonIcon alt="to end" iconName='MingcuteSkipForwardFill.svg' />
    </S.ButtonContainer>

    <S.ButtonContainer>
      <ButtonIcon alt="to end" iconName='MingcuteVolumeFill.svg' />
      <S.CurrentTime>
        {MathUtils.secondsToReadableText(currentTime)}
      </S.CurrentTime>
      <S.TotalDuration>
        / {MathUtils.secondsToReadableText(videoLength)}
      </S.TotalDuration>
    </S.ButtonContainer>
  </S.Container>
)