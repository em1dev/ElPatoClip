import { useEffect, useState } from "react";
import VideoEditor from ".";
import { useParams } from "react-router-dom";
import { ElPatoApi } from "../../../api/elPatoClipApi";

export const TwitchVideoEditor = () => {
  const { clipId } = useParams<{ clipId: string }>(); 
  const [loading, setIsLoading] = useState<boolean>(false);
  const [urlBlob, setUrlBlob] = useState<string | null>(null);

  useEffect(() => {
    if (!clipId) return;
    const onClipDownload = async (clipId: string) => {
      setIsLoading(true);
      const blob = await ElPatoApi.getClip(clipId);
      setUrlBlob(URL.createObjectURL(blob));
      setIsLoading(false);
    }
    onClipDownload(clipId);
  },[clipId]);

  if (loading) return (
    <div>loading...</div>
  );

  if (urlBlob) {
    return (
        <VideoEditor videoUrl={urlBlob} />
    );
  }
};