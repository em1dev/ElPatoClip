export interface ClipListRequestFilters {
  /**
   * on twitch api as first
   */
  amount: unknown,
  beforeCursor: unknown,
  afterCursor: unknown,
  isFeatured: unknown,
  startedAt: unknown,
  endedAt: unknown,
}

export interface ChannelSearchResponse {
  id: string,
  displayName: string,
  profileImg: string
}