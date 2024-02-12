import { ButtonIcon } from "../../Atoms/ButtonIcon";
import { MathUtils } from "../../../Utils/MathUtils";
import * as S from './styles';
import { Button } from "../../Atoms/Button";

export interface VideoHeaderProps {
  videoLength: number,
  currentTime: number,
  onRenderClick: () => void,
}

export const VideoHeader = ({
  currentTime,
  videoLength,
  onRenderClick
}: VideoHeaderProps) => (
  <S.Container>
    <span>
      Pato crea un editor de video
    </span>

    <S.ButtonContainer>
      <Button onClick={onRenderClick} theme='light'>Render</Button>
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