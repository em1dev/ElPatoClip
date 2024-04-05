
export const createRedirectUrl = (type: 'tiktok' | 'twitch', action : 'auth' | 'connect') => {
  if (type === 'tiktok') return `https://clip.elpato.dev/${action}/${type}`;
  return `${location.origin}/${action}/${type}`;
};

export const createTokenUrl = (type: 'tiktok' | 'twitch', action: 'auth' | 'connect') => {

  if (type === 'twitch') {
    if (action === 'connect') throw new Error('connection to twitch is not allowed');

    const redirectPath = createRedirectUrl(type, action);
    const scopes:Array<string> = [];
    const query = {
      response_type: 'code',
      client_id: 'xdwxjtm3b8lxwfsx1euxftxz6rcajy',
      redirect_uri: redirectPath,
      scope: scopes.join(','),
      state: 'c3ab8aa609ea11e793ae92361f002671',
    };


    return `https://id.twitch.tv/oauth2/authorize?${(new URLSearchParams(query)).toString()}`;
  }

  if (type === 'tiktok') {
    const scopes:Array<string> = action === 'auth' ? ['user.info.profile', 'user.info.basic'] : 
      ['user.info.profile', 'user.info.basic', 'video.upload', 'video.publish'];

    const query = {
      client_key: 'aw68k9974y4f5ymk',
      response_type: 'code',
      // tiktok does not support localhost :/
      redirect_uri: `https://clip.elpato.dev/${action}/${type}`,
      scope: scopes.join(','),
    };

    return `https://www.tiktok.com/v2/auth/authorize?${(new URLSearchParams(query)).toString()}`;
  }
};
