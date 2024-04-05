import * as S from './styles';
import { useRef, useState } from 'react';
import { Button } from '../../../../../Atoms/Button';
import { Input } from '../../../../../Atoms/Input';

export interface DownloadFormProps {
  videoUrl: string,
}

export const DownloadForm = ({
  videoUrl
}:DownloadFormProps) => {
  useRef();
  const [fileName, setFileName] = useState<string>('video');

  return (
    <S.Container>
      <div>
        <label htmlFor='download-clip-btn'>Download Clip</label>
        <Input id='download-clip-btn' value={fileName} onChange={(e) => { setFileName(e.target.value); }} />
      </div>

      <Button as='a' href={videoUrl} download={fileName + '.webm'} $variant='white'>Download</Button>
    </S.Container>
  );
};