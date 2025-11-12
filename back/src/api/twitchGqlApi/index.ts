import { GlqClipInfoResponse, GlqUserClips } from './types';

const BASE_URL = 'https://gql.twitch.tv/gql';
const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';
const HASH = '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11';

const CLIP_FIELDS = `
    id
    slug
    title
    createdAt
    viewCount
    durationSeconds
    url
    videoQualities {
        frameRate
        quality
        sourceURL
    }
    game {
        id
        name
    }
    broadcaster {
        displayName
        login
    }
`;

export class TwitchGqlApi {

  public getAllClips = async (channelId: string) => {
    const limit = 10;
    const after = 'MTA=';
    const period: 'ALL_TIME' | 'LAST_DAY' | 'LAST_WEEK' | 'LAST_MONTH' = 'ALL_TIME';
    const sort : 'VIEWS_DESC' | 'VIEWS_ASC' = 'VIEWS_DESC';

    /*
    List channel clips.

    At the time of writing this:
    * filtering by game name returns an error
    * sorting by anything but VIEWS_DESC or TRENDING returns an error
    * sorting by VIEWS_DESC and TRENDING returns the same results
    * there is no totalCount
    */
    const query = `
    {
      user(login: "${channelId}") {
        clips(first: ${limit}, after: "${after}", criteria: { period: ${period}, sort: ${sort}, isFeatured: false }) {
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ${CLIP_FIELDS}
            }
          }
        }
      }
    }
    `;
    const resp = await this.callApi<GlqUserClips>(query);
    const data = resp.data.user.clips.edges.map((clip) => ({
      id: clip.node.id,
      slug: clip.node.slug,
      title: clip.node.title,
      url: clip.node.url,
      viewCount: clip.node.viewCount
    }));
    return data;
  };

  private callApi = async <T>(query: string, isQuery: boolean = true) => {
    const parsedBody = isQuery ? JSON.stringify({ query }) : query;
    const resp = await fetch(BASE_URL, {
      method: 'POST',
      headers: new Headers({
        'Client-ID': CLIENT_ID,
        'content-type': 'application/json'
      }),
      body: parsedBody
    });
    return await resp.json() as T;
  };

  public getDownloadClipUrl = async (slug: string) => {
    const clipAccessTokenQuery = {
      operationName: 'VideoAccessToken_Clip',
      variables: {
        slug
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: HASH,
        }
      }
    };

    const resp = await this.callApi<GlqClipInfoResponse>(JSON.stringify(clipAccessTokenQuery), false);
    const clip = resp.data.clip!;
  
    let clipUrl = clip.videoQualities.at(0)?.sourceURL;
    if (!clipUrl) {
      throw new Error('clip quality not found');
    }
    clipUrl = `${clipUrl}?sig=${clip.playbackAccessToken.signature}&token=${encodeURIComponent(clip.playbackAccessToken.value)}`;
    return clipUrl;
  };
}