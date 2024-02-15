import * as S from './styles';
import { useFfmpeg } from '../../../../ffmpeg';
import { Layer } from '../../../../types';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../Atoms/Button';

export interface ExportModalProps {
  videoUrl: string,
  startTime: number,
  endTime: number,
  layers: Array<Layer>,
  closeModal: () => void,
}

export const ExportModal = ({
  endTime,
  layers,
  startTime,
  videoUrl,
  closeModal
}: ExportModalProps) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<Array<string>>([]);
  const { editVideo, wasmLoaded, cancel } = useFfmpeg((log) => setLogs((prev) => [...prev, log]));
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

  const onCancel = () => {
    cancel();
    // delay closing of modal to avoid memory unallocated access
    setTimeout(() => {
      closeModal();
    }, 100)
  }

  useEffect(() => {
    if (!logContainerRef.current) return;
    logContainerRef.current.scrollTo({ behavior: 'smooth', top: 1000000000 });
  }, [logs]);

  return (
    <S.Container>
      {generatedUrl && (
        <>
          <S.VideoContainer>
            <video controls src={generatedUrl} />
          </S.VideoContainer>
          <div>
            <Button theme='light' onClick={onDownloadClick}>Download</Button>
            <Button theme='dark' onClick={closeModal}>Close</Button>
          </div>
        </>
      )}
      {!generatedUrl && (
        <>
          <S.LogContainer ref={logContainerRef}>
            {logs.map((log,i) => (
              <div key={i}>{log}</div>
            ))}
          </S.LogContainer>
          <S.LogButtonContainer>
            <Button theme='light' onClick={onCancel}>Cancel</Button>
          </S.LogButtonContainer>
        </>
      )}
    </S.Container>
  )
};