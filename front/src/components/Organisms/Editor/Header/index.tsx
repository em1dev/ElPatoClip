import * as S from './styles';
import { Button } from '../../../Atoms/Button';
import { useEditorState } from '../../../../store/EditorState/useEditorState';

export interface EditorHeader {
  onExportClick: () => void,
}

export const EditorHeader = ({
  onExportClick,
}: EditorHeader) => {
  const selectedVisibleCanvas = useEditorState(state => state.selectedVisibleCanvas);
  const onSelectedVisibleCanvas = useEditorState(state => state.setSelectedVisibleCanvas);

  const onClick = () => {
    history.go(-1);
  };

  return (
    <S.Container>
      <a onClick={onClick}>
        <img alt='' width={20} src="/icons/MingcuteLeftFill.svg"></img>
        back
      </a>

      <S.CanvasSelectionContainer>
        <S.CanvasSelectionButton 
          type="button"
          title="Both"
          onClick={() => onSelectedVisibleCanvas('both')}
          selected={selectedVisibleCanvas === 'both'}
        >
          <img aria-hidden src="/icons/DualCanvasIcon.svg"></img>
        </S.CanvasSelectionButton>

        <S.CanvasSelectionButton
          type="button"
          title="Portrait"
          onClick={() => onSelectedVisibleCanvas('portrait')}
          selected={selectedVisibleCanvas == 'portrait'}
        >
          <img aria-hidden src="/icons/PortraitIcon.svg"></img>
        </S.CanvasSelectionButton>

        <S.CanvasSelectionButton
          type="button"
          selected={selectedVisibleCanvas == 'landscape'}
          title="Landscape" onClick={() => onSelectedVisibleCanvas('landscape')}
        >
          <img aria-hidden src="/icons/LandscapeIcon.svg"></img>
        </S.CanvasSelectionButton>
      </S.CanvasSelectionContainer>

      <Button $variant='outline' onClick={onExportClick}>
        Export
      </Button>
    </S.Container>
  );
};