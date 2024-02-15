import * as S from './styles';
import { useEffect, useState } from "react";
import VideoEditor from ".";
import { useParams } from "react-router-dom";
import { ElPatoApi } from "../../../api/elPatoClipApi";
import { Loading } from "../../Atoms/Loading";

const bytesToRedable = (amount: number) => {
  if (amount > 1000000) {
    // mb
    return (amount / 1000000).toFixed(2).toString() + ' mb'
  } else {
    // kb
    return (amount / 10000).toString() + ' kb'
  }
}

export const TwitchVideoEditor = () => {
  const { clipId } = useParams<{ clipId: string }>(); 
  const [loading, setIsLoading] = useState<boolean>(false);
  const [urlBlob, setUrlBlob] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    amount: string,
    total: string
  } | null>(null);

  useEffect(() => {
    if (!clipId) return;
    const onClipDownload = async (clipId: string) => {
      setIsLoading(true);
      const blob = await ElPatoApi.getClip(clipId, (amount, total) => {

        const totalStr = total === 0 ? '?' : bytesToRedable(total);

        setProgress({
          amount: bytesToRedable(amount),
          total: totalStr
        });
      });
      setUrlBlob(URL.createObjectURL(blob));
      setIsLoading(false);
      setProgress(null);
    }
    onClipDownload(clipId);
  },[clipId]);

  if (loading) return (
    <S.LoadingVideoContainer>
      <Loading />
      <div>Downloading clip</div>
      { progress && (
        <S.Progress>{progress.amount} / {progress.total}</S.Progress>
      )}
    </S.LoadingVideoContainer>
  );

  if (urlBlob) {
    return (
        <VideoEditor videoUrl={urlBlob} />
    );
  }
};