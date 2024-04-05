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

export interface ChannelDetails {
  id: string,
  login: string,
  display_name: string,
  type: 'admin' | 'global_mod' | 'staff' | '',
  broadcaster_type: 'affiliate' | 'partner' | '',
  description: string,
  profile_image_url: string,
  offline_image_url: string,
  created_at: string
}

export interface ElPatoConnection {
  type: 'twitch' | 'tiktok',
  displayName: string,
  profileImageUrl: string
}

//

export interface TikTokResponse<T> {
  data: T,
  error: {
    code: string,
    message: string,
    log_id: string
  }
}

export interface CreatorPublishPermissions {
  creator_avatar_url: string,
  creator_username: string,
  creator_nickname: string,
  privacy_level_options: Array<
    'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 
    'SELF_ONLY' | 'FOLLOWER_OF_CREATOR' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY'
  >,
  comment_disabled: boolean,
  duet_disabled: boolean,
  stitch_disabled: boolean,
  max_video_post_duration_sec: number,
}

export interface CreatorPublishPermissionResponse extends TikTokResponse<CreatorPublishPermissions> {}

export interface TiktokUploadStatus {
  status: 'FAILED' | 'PROCESSING_UPLOAD' | 'PROCESSING_DOWNLOAD' | 'SEND_TO_USER_INBOX' | 'PUBLISH_COMPLETE' | 'FAILED',
  fail_reason: string,
  publicaly_available_post_id: Array<number>,
  uploaded_bytes: number
}

export interface TiktokUploadStatusResponse extends TikTokResponse<TiktokUploadStatus> {}

export interface PostVideoPayload {
  post_info: VideoPostInfo,
  source_info: VideoSourceInfo
}

export interface VideoPostInfo {
  title: string,
  privacy_level: string,
  disable_duet: boolean,
  disable_comment: boolean,
  disable_stitch: boolean,
  video_cover_timestamp_ms: number,
  brand_content_toggle: boolean,
  brand_organic_toggle: boolean,
}

export interface VideoSourceInfo {
  source: 'PULL_FROM_URL' | 'FILE_UPLOAD',
  video_size: number,
  chunk_size: number,
  total_chunk_count: number
}