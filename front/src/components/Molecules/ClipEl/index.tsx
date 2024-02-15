import { forwardRef } from 'react';
import { MathUtils } from '../../../Utils/MathUtils';
import { Clip } from '../../../api/elPatoClipApi/types';
import { Badge } from '../../Atoms/Badge';
import ClipFooterMetadata from '../ClipFooterMetadata';
import * as S from './styles';

export interface ClipProps {
  clip: Clip,
  onClick: () => void,
}

const ClipEl = forwardRef<HTMLButtonElement, ClipProps>(({ clip, onClick }: ClipProps, ref) => (
  <S.Container ref={ref} onClick={onClick}>
    <S.EmbedContainer>
      <Badge>{MathUtils.secondsToReadableText(clip.duration)}</Badge>
        <img alt={`clip ${clip.title}`} src={clip.thumbnail_url}></img>
      <Badge>{clip.view_count} views</Badge>
    </S.EmbedContainer>

    <ClipFooterMetadata 
      title={clip.title}
      rightTitle={new Date(clip.created_at).toLocaleDateString()}
      subTitle={`Clipped by: ${clip.creator_name}`}
    />
  </S.Container>
));

export default ClipEl;