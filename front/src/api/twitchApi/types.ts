export type GlqClipInfoResponse = [
  {
    data: {
      clip?: GlqClip
    },
    extensions: {
      durationMilliseconds: number,
      operationName: string,
      requestID: string,
    }
  }
];

export interface GlqClip {
  id: string,
  playbackAccessToken: {
    signature: string,
    /**
     * stringified json
     */
    value: string
  },
  videoQualities: Array<{
    sourceURL: string,
  }>,
  game: {
    id: string,
    name: string
  },
  broadcaster: {
    id: string
  }
}