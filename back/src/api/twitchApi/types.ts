export interface AuthenticationResponse {
  access_token: string,
  expires_in: number,
  token_type: "bearer"
}

export interface TwitchPaginatedResult<T> {
  data: Array<T>,
  pagination: {
    cursor: string,
  }
}

export interface TwitchClip {
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

export interface TwitchClipFilters {
  broadcaster_id: string,
  game_id?: string,
  id?: string,
  started_at?: string,
  ended_at?: string,
  first?: number,
  before?: string,
  after?: string,
  is_featured?: boolean
}

export interface ChannelDetails {
  display_name: string,
  id: string,
  thumbnail_url: string
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

export interface UserDetailsResponse {
  data: Array<UserDetails>,
}