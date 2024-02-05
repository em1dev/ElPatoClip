import { ButtonIcon } from "../../Atoms/ButtonIcon";
import { MathUtils } from "../../../Utils/MathUtils";
import * as S from './styles';

export interface VideoHeaderProps {
  videoLength: number,
  currentTime: number
}

export const VideoHeader = ({
  currentTime,
  videoLength
}: VideoHeaderProps) => (
  <S.Container>
    <span>
      Pato crea un editor de video
    </span>

    <S.ButtonContainer>
      <ButtonIcon alt="to end" iconName='MingcuteVolumeFill.svg' />
      <S.CurrentTime>
        {MathUtils.secondsToReadableText(currentTime, true)}
      </S.CurrentTime>
      <S.TotalDuration>
        / {MathUtils.secondsToReadableText(videoLength, true)}
      </S.TotalDuration>
    </S.ButtonContainer>
  </S.Container>
)