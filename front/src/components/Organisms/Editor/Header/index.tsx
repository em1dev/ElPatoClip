import * as S from './styles';
import { Button } from '../../../Atoms/Button';
import { VisibleCanvas } from '../../../../types';

export interface EditorHeader {
  onExportClick: () => void,
  selectedVisbleCanvas: VisibleCanvas,
  onSelectedVisibleCanvas: (canvas: VisibleCanvas) => void,
}

export const EditorHeader = ({
  onExportClick,
  onSelectedVisibleCanvas,
  selectedVisbleCanvas
}: EditorHeader) => {

  const onClick = () => {
    history.go(-1);
  };

  return (
    <S.Container>
      <a onClick={onClick}>
        <img width={20} src="/icons/MingcuteLeftFill.svg"></img>
        back
      </a>

      <S.CanvasSelectionContainer>
        <S.CanvasSelectionButton 
          type="button"
          title="Both" 
          onClick={() => onSelectedVisibleCanvas('both')}
          selected={selectedVisbleCanvas === 'both'}
        >
          <img aria-hidden src="/icons/DualCanvasIcon.svg"></img>
        </S.CanvasSelectionButton>

        <S.CanvasSelectionButton 
          type="button"
          title="Both" 
          onClick={() => onSelectedVisibleCanvas('potrait')}
          selected={selectedVisbleCanvas == 'potrait'}
        >
          <img aria-hidden src="/icons/PotraitIcon.svg"></img>
        </S.CanvasSelectionButton>

        <S.CanvasSelectionButton 
          type="button"
          selected={selectedVisbleCanvas == 'landscape'}
          title="Both" onClick={() => onSelectedVisibleCanvas('landscape')}
        >
          <img aria-hidden src="/icons/LandscapeIcon.svg"></img>
        </S.CanvasSelectionButton>
      </S.CanvasSelectionContainer>

      <Button onClick={onExportClick}>
        Export
      </Button>
    </S.Container>
  );
};