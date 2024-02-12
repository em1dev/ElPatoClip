export interface ClipsResponse {
  data: Array<Clip>,
  pagination: {
    cursor?: string,
  }
}

export interface Clip {
  id: string
  url: string
  embed_url: string
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  video_id: string
  game_id: string
  language: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
  vod_offset: number
  is_featured: boolean
}

export interface ClipListRequestFilters {
  /**
   * on twitch api as first
   */
  amount: number,
  beforeCursor?: string,
  afterCursor?: string,
  isFeatured?: boolean,
  startedAt?: string,
  endedAt?: string,
}

export interface ChannelSearchResponse {
  id: string,
  displayName: string,
  profileImg: string
}

export interface UserDetails {
  id: string,
  login: string,
  display_name: string,
  type: 'admin' | 'global_mod' | 'staff' | '',
  broadcaster_type: 'affiliate' | 'partener' | '',
  description: string,
  profile_image_url: string,
  offline_image_url: string,
  created_at: string
}