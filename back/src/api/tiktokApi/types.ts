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