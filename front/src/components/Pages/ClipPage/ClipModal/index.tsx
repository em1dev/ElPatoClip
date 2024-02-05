import * as S from './styles';
import { Clip } from "../../../../api/elPatoClipApi/types";
import ClipFooterMetadata from '../../../Molecules/ClipFooterMetadata';

export interface ClipModalProps {
  clip: Clip,
  onEdit: () => void,
}

const ClipModal = ({ clip, onEdit }: ClipModalProps) => (
  <S.Container>
    <iframe allowFullScreen height={1080} width={1080} 
      src={`https://clips.twitch.tv/embed?clip=${clip.id}&parent=${location.hostname}&autoplay=true&muted=false`}
    ></iframe>
    <ClipFooterMetadata 
      title={clip.title}
      rightTitle={'02/20/2024'}
      subTitle={`Created by: ${clip.created_at}`}
      subTitleRight={<S.Button onClick={onEdit}>Edit</S.Button>}
    />
  </S.Container>
);

export default ClipModal;

