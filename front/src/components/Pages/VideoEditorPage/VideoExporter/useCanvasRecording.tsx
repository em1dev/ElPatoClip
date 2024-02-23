import { RefObject, useCallback, useState } from "react";

export const useCanvasRecording = (
  canvasRef: RefObject<HTMLCanvasElement>,
  videoRef: RefObject<HTMLVideoElement>) => {
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const record = useCallback((duration: number) => {
    if (!canvasRef.current) return;
    if (!videoRef.current) return;

    let recordedData: Array<Blob> = [];

    console.log('initializing recording');

    const options: MediaRecorderOptions = { 
      // TODO - check if is supported
      mimeType: 'video/webm',
      videoBitsPerSecond: 6000 * 1000, // max twitch bitrate,
    };

    const canvasStream = canvasRef.current.captureStream(60);


    const videoAsCompatibleMedia = (videoRef.current as unknown as {
      captureStream?: (fps: number) => MediaStream
      mozCaptureStream?: (fps: number) => MediaStream,
      audioTracks?: Array<MediaStreamTrack>
    });

    let audioTrack: MediaStreamTrack | null = null;

    if (videoAsCompatibleMedia.captureStream) {
      // chromium
      const videoStream = videoAsCompatibleMedia.captureStream(60);
      audioTrack = videoStream.getAudioTracks().at(0)!;
    } else if (videoAsCompatibleMedia.mozCaptureStream) {
      // moz
      const videoStream = videoAsCompatibleMedia.mozCaptureStream(60);
      audioTrack = videoStream.getAudioTracks().at(0)!;
    } else if (videoAsCompatibleMedia.audioTracks){
      // webkit
      audioTrack = videoAsCompatibleMedia.audioTracks.at(0)!;
    } else {
      throw new Error('Capture media stream is not implemented in this browser');
    }

    const combinedMedia = new MediaStream([ 
      audioTrack,
      canvasStream.getVideoTracks()[0]!
    ]);

    const recorder = new MediaRecorder(combinedMedia, options);

    recorder.ondataavailable = (e) => {
      console.log('recording data received', e.data.size);
      if (e.data.size <= 0) {
        console.log('could not record anything');
        // todo - error handling here
        return;
      }
      recordedData = [...recordedData, e.data];
    };

    recorder.onstop = () => {
      if (recordedData.length <= 0) {
        throw new Error('no video data to render');
      }

      const blob = new Blob(recordedData, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    };
    recorder.start();

    setTimeout(() => {
      recorder.stop();
    }, duration);

  }, [canvasRef, videoRef]);

  return {
    record,
    outputUrl
  }
};