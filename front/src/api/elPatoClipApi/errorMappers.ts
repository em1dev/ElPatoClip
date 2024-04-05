export const tiktokVideoUploadStatusErrorMap:Record<string, string> = {
  'invalid_publish_id': 'Invalid data',
  'token_not_authorized_for_specified_publish_id': 'Session has expired. Reload and try again',
  'access_token_invalid': 'Session has expired. Reload and try again',
  'scope_not_authorized': 'Session has expired. Reload and try again',
  'rate_limit_exceeded': 'Too many requests. Please try again later',
  'internal_error': 'Internal error, please try again later'
};

export const tiktokErrorMap: Record<string, string> = {
  invalid_param: 'Invalid data',
  spam_risk_too_many_posts: 'You have reached your daily post cap. Please wait 24 hours before posting again',
  spam_risk_user_banned_from_posting: 'This account has been banned from making new posts',
  reached_active_user_cap: 'Application has reached post cap. Please wait 24 hours before posting.',
  unaudited_client_can_only_post_to_private_accounts: 'Please change your tiktok account privacy settings to private',
  url_ownership_unverified: 'Unhandled error',
  privacy_level_option_mismatch: 'Data mismatch. Please refresh the page and try again',
  access_token_invalid: 'Invalid access, please reload and try again',
  scope_not_authorized: 'Invalid access, please reload and try again',
  rate_limit_exceeded: 'Application has reached post cap. Please wait 24 hours before posting.',
};