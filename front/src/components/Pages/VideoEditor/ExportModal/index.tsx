import * as S from './styles';
import { useFfmpeg } from '../../../../ffmpeg';
import { Layer } from '../../../../types';
import { useEffect, useState } from 'react';
import { Button } from '../../../Atoms/Button';

export interface ExportModalProps {
  videoUrl: string,
  startTime: number,
  endTime: number,
  layers: Array<Layer>
}

export const ExportModal = ({
  endTime,
  layers,
  startTime,
  videoUrl
}: ExportModalProps) => {
  const [logs, setLogs] = useState<string>('');
  const { editVideo, wasmLoaded } = useFfmpeg((logs) => setLogs((prev) => prev + logs + '\n'));
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!wasmLoaded) return;
    (async () => {
      const urlBlob = await editVideo(videoUrl, {
        startTime: startTime,
        endTime: endTime,
        layer: layers,
      });
      setGeneratedUrl(urlBlob);
    })();
  }, [wasmLoaded, videoUrl, layers, startTime, endTime, editVideo]);

  const onDownloadClick = () => {
    if (!generatedUrl) return;
    const a = document.createElement('a');
    a.href = generatedUrl;
    document.body.appendChild(a);
    a.download = 'out.mp4';
    a.click();
    document.body.removeChild(a);
  }

  return (
    <S.Container>
      {generatedUrl && (
          <S.VideoContainer>
            <video controls src={generatedUrl} />
          </S.VideoContainer>
      )}
      {!generatedUrl && (
        <S.LogContainer>
        {logs}
        </S.LogContainer>
      )}

      <div>
        <Button theme='light' onClick={onDownloadClick} disabled={!generatedUrl}>Download</Button>
      </div>
    </S.Container>
  )
};