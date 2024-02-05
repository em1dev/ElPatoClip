import { Clip } from '../../../api/elPatoClipApi/types';
import { Badge } from '../../Atoms/Badge';
import ClipFooterMetadata from '../ClipFooterMetadata';
import * as S from './styles';

export interface ClipProps {
  clip: Clip,
  onClick: () => void,
}

const ClipEl = ({ clip, onClick }: ClipProps) => (
  <S.Container onClick={onClick}>
    <S.EmbedContainer>
      <Badge>01:20</Badge>
        <img crossOrigin='use-credentials' alt={`clip ${clip.title}`} src={clip.thumbnail_url}></img>
      <Badge>5 views</Badge>
    </S.EmbedContainer>

    <ClipFooterMetadata 
      title={clip.title}
      rightTitle={'03/02/2024'}
      subTitle={`Clipped by: ${clip.creator_name}`}
    />
  </S.Container>
);

export default ClipEl;