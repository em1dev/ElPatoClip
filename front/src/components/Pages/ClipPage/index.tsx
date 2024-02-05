import * as S from './styles';
import { useEffect, useRef, useState } from 'react';
import { Clip } from '../../../api/elPatoClipApi/types';
import { ClipApi } from '../../../api/elPatoClipApi';
import ClipEl from '../../Molecules/ClipEl';
import ClipModal from './ClipModal';

const CHANNEL_NAME = '63509391';

export interface ClipPageProps {
  onEditClip: (clip: Clip) => void;
}

const ClipPage = ({ onEditClip }: ClipPageProps) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [clips, setClips] = useState<Array<Clip>>([]);
  const selectedClip = clips.find(clip => clip.id === selectedClipId);

  useEffect(() => {
    (async () => {
      const resp = await ClipApi.getClips(CHANNEL_NAME, {
        amount: 10,
      });
      setClips(resp);
    })();
  }, []);

  useEffect(() => {
    const el = modalContainerRef.current;
    const onBodyClick = (e: MouseEvent) => {
      if (!selectedClip) return;
      if (e.target !== el) return;
      setSelectedClipId(null);
    };

    el?.addEventListener('click', onBodyClick);
    return () => {
      el?.removeEventListener('click', onBodyClick);
    }
  }, [selectedClip]);


  return (
    <S.Container>
      {selectedClip && (
        <S.ModalOverlay ref={modalContainerRef}>
          <ClipModal clip={selectedClip} onEdit={() => onEditClip(selectedClip)} />
        </S.ModalOverlay>
      )}

      {clips.map((clip) => (
        <ClipEl key={clip.id} clip={clip} onClick={() => setSelectedClipId(clip.id)} />
      ))}
    </S.Container>
  )
}

export default ClipPage
