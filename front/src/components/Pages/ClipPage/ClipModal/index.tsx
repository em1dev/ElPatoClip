import * as S from './styles';
import { Clip } from "../../../../api/elPatoClipApi/types";
import ClipFooterMetadata from '../../../Molecules/ClipFooterMetadata';

export interface ClipModalProps {
  clip: Clip,
}

const ClipModal = ({ clip }: ClipModalProps) => (
  <S.Container>
    <iframe allowFullScreen height={1080} width={1080} 
      src={`https://clips.twitch.tv/embed?clip=${clip.id}&parent=${location.hostname}&autoplay=true&muted=false`}
    ></iframe>
    <ClipFooterMetadata 
      title={clip.title}
      rightTitle={new Date(clip.created_at).toLocaleDateString()}
      subTitle={`Created by: ${clip.creator_name}`}
      subTitleRight={<S.Button reloadDocument to={`${location.origin}/editor/${clip.id}`}>Edit</S.Button>}
    />
  </S.Container>
);

export default ClipModal;

