import { MathUtils } from '../../../../../../Utils/MathUtils';
import { useEditorState } from '../../../../../../store/EditorState/useEditorState';
import * as S from '../../styles';

export const VideoTime = () => {
  const videoMetadata = useEditorState(state => state.videoMetadata);

  return (
    <div>
      <S.CurrentTime>
        {MathUtils.secondsToReadableText(videoMetadata.currentTime, true)}
      </S.CurrentTime>
      <S.TotalDuration>
          / {MathUtils.secondsToReadableText(videoMetadata.totalTime, true)}
      </S.TotalDuration>
    </div>
  );
};