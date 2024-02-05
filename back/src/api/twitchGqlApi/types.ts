export interface GlqBaseExtension {
  durationMilliseconds: number,
  requestID: string,
}

export interface GlqResponse<T, U extends GlqBaseExtension = GlqBaseExtension> {
  data: T,
  extensions: U
}

export interface GlqClipInfoResponse extends GlqResponse<{ clip?: GlqClip }>{};
export interface GlqUserClips extends GlqResponse<{
  user: {
    clips: {
      pageInfo: {
        endCursor: string
        hasNextPage: true,
        hasPreviousPage: false
      },
      edges: Array<{
            cursor: null | string,
            node: {
              id: string,
              slug: string,
              title: string,
              createdAt: string,
              viewCount: number,
              durationSeconds: number,
              url: string,
            }
          }>,
    }
  }
}>{};

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