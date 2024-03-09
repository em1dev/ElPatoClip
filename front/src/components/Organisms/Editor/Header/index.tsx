import * as S from './styles';
import { Button } from "../../../Atoms/Button";

export interface EditorHeader {
  onExportClick: () => void,
}

export const EditorHeader = ({
  onExportClick
}: EditorHeader) => {

  const onClick = () => {
    history.go(-1);
  }

  return (
    <S.Container>
      <a onClick={onClick}>
        <img width={20} src="/public/icons/MingcuteLeftFill.svg"></img>
        back
      </a>

      <Button onClick={onExportClick}>
        Export
      </Button>
    </S.Container>
  );
};