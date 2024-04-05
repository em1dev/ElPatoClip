import * as S from './styles';
import { Timeline } from '../../../Molecules/Editor/Timeline';
import { VideoControls } from './VideoControls';


export const Footer = () => (
  <S.Container>
    <VideoControls />

    <S.TimelineContainer>
      <Timeline />
    </S.TimelineContainer>

  </S.Container>
);