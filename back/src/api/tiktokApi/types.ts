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

export interface PostInfo {
  privacy_level: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY',

  /**
   * max length 2200 utf-16
   */
  title?: string,
  disable_duet?: boolean,
  disable_stitch?: boolean,
  disable_comment?: boolean,
  video_cover_timestamp_ms: number,
  /**
   * promote third party business
   */
  brand_content_toggle: boolean,
  /**
   * promote own business
   */
  brand_organic_toggle: boolean,
}

export interface SourceInfo {
  source: 'PULL_FROM_URL' | 'FILE_UPLOAD',
  video_size: number,
  chunk_size: number,
  total_chunk_count: number
}

export interface PostVideoRequest {
  post_info: PostInfo,
  source_info: SourceInfo
}

export interface VideoObject {
  id: string,
  /**
   * UTC Unix epoch (in seconds)
   */
  create_time: number,
  cover_image_url: string,
  share_url: string,
  video_description: string,
  /**
   * in seconds
   */
  duration: number,
  height: number,
  width:  number,
  /**
   * max length 150
   */
  title: string,
  embed_html: string,
  embed_link: string,
  like_count: number,
  comment_count: number,
  share_count: number,
  view_count: number,
}

export interface StatusResponse {
  data: {
    status: 'FAILED' | 'PROCESSING_UPLOAD' | 'PROCESSING_DOWNLOAD' | 'SEND_TO_USER_INBOX' | 'PUBLISH_COMPLETE' | 'FAILED',
    fail_reason: string,
    publicaly_available_post_id: Array<number>,
    uploaded_bytes: number
  },
  error: {
    code: string,
    message: string,
    log_id: string
  }
}

