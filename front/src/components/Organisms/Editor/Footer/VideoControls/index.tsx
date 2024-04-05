import * as S from '../styles';
import { ButtonIcon } from '../../../../Atoms/ButtonIcon';
import { VideoTime } from './VideoTime';
import { useEditorState } from '../../../../../store/EditorState/useEditorState';
import { PlaybackControls } from './PlaybackControls';

export const VideoControls = () => {
  const volume = useEditorState(state => state.volume);
  const setVolume = useEditorState(state => state.setVolume);
  const isMuted = useEditorState(state => state.isMuted);
  const setIsMuted = useEditorState(state => state.setIsMuted);

  return (
    <div>
      <VideoTime />
      <PlaybackControls />

      <S.VolumeContainer>
        <input 
          type="range" 
          min={0} 
          max={10} 
          step={1} 
          value={volume * 10}
          onChange={(e) => setVolume(parseInt(e.target.value) / 10)}
        />

        <ButtonIcon 
          onClick={() => setIsMuted(!isMuted)} 
          alt="toggle mute"
          iconName={isMuted ? 'MingcuteVolumeMuteFill.svg' : 'MingcuteVolumeFill.svg'}
        />
      </S.VolumeContainer>
    </div>

  );
};