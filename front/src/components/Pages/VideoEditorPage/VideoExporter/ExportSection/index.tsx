import * as S from './styles';
import { useCallback } from 'react';
import { TiktokPublishForm } from './TiktokPublishForm';
import { useAuth } from '../../../../../authContext/useAuth';
import { Button } from '../../../../Atoms/Button';
import { DownloadForm } from './DownloadForm';
import { useEditorState } from '../../../../../store/EditorState/useEditorState';
import { useNavigate } from 'react-router-dom';


export interface ExportSectionProps {
  videoUrl: string,
  retryExport: () => void
}

export const ExportSection = ({ videoUrl, retryExport  }: ExportSectionProps) => {
  const navigate = useNavigate();
  const auth =  useAuth();
  const setIsExporting = useEditorState((state) => state.setIsExporting);

  const onLoginClick = useCallback(() => {
    const url = `${location.origin}/login`;
    window.open(url, 'popup', 'toolbar=0,status=0,width=626,height=636');
  }, []);

  const onDone = useCallback(() => {
    setIsExporting(false);
    navigate('/');
  }, [navigate, setIsExporting]);

  const onBackToEditor = useCallback(() => {
    setIsExporting(false);
  },[setIsExporting]);

  return (
    <S.Container>
      { auth.isAuthorized && (
        <TiktokPublishForm retryRecording={retryExport} videoUrl={videoUrl} />
      )}

      <DownloadForm videoUrl={videoUrl} />

      { !auth.isAuthorized && (
        <S.LogInContainer>
          <p>You must be logged in to upload to tiktok or youtube</p>
          <Button onClick={onLoginClick} $variant='white'>Log in</Button>
        </S.LogInContainer>
      )}

      <S.ButtonContainer>
        <Button onClick={onBackToEditor} $variant='outline'>Back to editor</Button>
        <Button onClick={onDone} $variant='primary'>Done</Button>
      </S.ButtonContainer>
    </S.Container>
  );
};