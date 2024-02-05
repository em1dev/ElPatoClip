import { useState } from 'react';
import './App.css'
import VideoEditor from './components/VideoEditor';
import { ClipApi } from './api/elPatoClipApi';
import ClipPage from './components/Pages/ClipPage';
import { Clip } from './api/elPatoClipApi/types';

function App() {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [urlBlob, setUrlBlob] = useState<string | null>(null);

  const onClipDownload = async (clip:Clip) => {
    setIsLoading(true);
    const blob = await ClipApi.getClip(clip.id);
    setUrlBlob(URL.createObjectURL(blob));
    setIsLoading(false);
  }

  if (loading) return (
    <div>loading...</div>
  );

  if (urlBlob) {
    return (
        <VideoEditor videoUrl={urlBlob} />
    );
  }

  return (
    <ClipPage onEditClip={onClipDownload} />
  )
}

export default App
