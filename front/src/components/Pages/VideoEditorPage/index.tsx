import * as S from './styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { Loading } from '../../Atoms/Loading';
import { VideoExporter } from './VideoExporter';
import VideoEditor from '../../Organisms/Editor';
import { useEditorState } from '../../../store/EditorState/useEditorState';

const bytesToReadable = (amount: number) => {
  if (amount > 1000000) {
    // mb
    return (amount / 1000000).toFixed(2).toString() + ' MiB';
  } else {
    // kb
    return (amount / 10000).toString() + ' KB';
  }
};

export const VideoEditorPage = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const videoBlobUrl = useEditorState((state) => state.videoBlobUrl);
  const setClipId = useEditorState((state) => state.setClipId);
  const isExporting = useEditorState((state) => state.isExporting);
  const setIsExporting = useEditorState((state) => state.setIsExporting);

  const { clipId } = useParams<{ clipId: string }>(); 
  const [loading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<{
    amount: string,
    total: string
  } | null>(null);

  useEffect(() => {
    if (!clipId) return;
    const onClipDownload = async (clipId: string) => {
      const storageKey = 'ElPatoClip.CachedVideo';

      /*
      const cache = localStorage.getItem(storageKey);
      if (cache) {
        const cacheBlob = JSON.parse(cache);
        if (cacheBlob['id'] === clipId) {
          console.log('loaded from cache');
          setClipId(clipId, cacheBlob['blobUrl']);
          return;
        }
      }
      */

      setIsLoading(true);
      // get clip metadata
      const resp = await ElPatoApi.getClip(clipId, (amount, total) => {
        const totalStr = total === 0 ? '?' : bytesToReadable(total);

        setProgress({
          amount: bytesToReadable(amount),
          total: totalStr
        });
      });

      if (resp.error) {
        setHasError(true);
        setIsLoading(false);
        setProgress(null);
        return;
      }

      const blobUrl = URL.createObjectURL(resp.data);
      setClipId(clipId, blobUrl);
      setIsLoading(false);
      setProgress(null);
      localStorage.setItem(storageKey, JSON.stringify({
        id: clipId,
        blobUrl
      }));
    };
    onClipDownload(clipId);
  },[setClipId, clipId]);

  if (loading) return (
    <S.LoadingVideoContainer>
      <Loading />
      <div>Downloading clip</div>
      { progress && (
        <S.Progress>{progress.amount} / {progress.total}</S.Progress>
      )}
    </S.LoadingVideoContainer>
  );

  if (hasError) return (
    <div>Error loading clip. Please try again later</div>
  );

  if (isExporting && videoBlobUrl) {
    return (
      <VideoExporter />
    );
  }

  if (videoBlobUrl) {
    return (
      <VideoEditor onExport={() => setIsExporting(true)}
      />
    );
  }
};