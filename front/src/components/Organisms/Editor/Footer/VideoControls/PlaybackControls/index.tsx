import { ButtonIcon } from '../../../../../Atoms/ButtonIcon';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';
import * as S from './styles';


export const PlaybackControls = () => {
  const seekBackwards = useEditorState(state => state.seekBackwards);
  const seekForward = useEditorState(state => state.seekForward);
  const seekToEnd = useEditorState(state => state.seekToEnd);
  const seekToStart = useEditorState(state => state.seekToStart);
  const isPlaying = useEditorState(state => state.isPlaying);
  const setPlayback = useEditorState(state => state.setPlayback);

  return (
    <S.Container>
      <ButtonIcon onClick={seekToStart} title="to start" iconName='MingcuteSkipPreviousFill.svg' />
      <ButtonIcon onClick={seekBackwards} title="rewind" iconName='MingcuteFastRewindFill.svg' />
      {isPlaying ?
        <ButtonIcon onClick={() => setPlayback(false)} title="pause" iconName='MingcutePauseFill.svg' /> :
        <ButtonIcon onClick={() => setPlayback(true)} title="play" iconName='MingcutePlayFill.svg' />
      }
      <ButtonIcon onClick={seekForward} title="forward" iconName='MingcuteFastForwardFill.svg' />
      <ButtonIcon onClick={seekToEnd} title="to end" iconName='MingcuteSkipForwardFill.svg' />
    </S.Container>
  );
};