import { GlqClipInfoResponse, GlqUserClips } from "./types";

const BASE_URL = 'https://gql.twitch.tv/gql';
const CLIENT_ID = 'kd1unb4b3q4t58fwlpcbzcbnm76a8fp';
const HASH = '6e465bb8446e2391644cf079851c0cb1b96928435a240f07ed4b240f0acc6f1b';

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
    const after = "MTA=";
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
  }

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
    const data = [
          {
              operationName: "ClipsDownloadButton",
              variables: {
                  slug,
              },
              extensions: {
                  persistedQuery: {
                      version: 1,
                      sha256Hash: HASH,
                  }
              },
          }
      ];
    const resp = await this.callApi<Array<GlqClipInfoResponse>>(JSON.stringify(data), false);
    const clip = resp[0].data.clip!;
  
    let clipUrl = clip.videoQualities.at(0)?.sourceURL;
    if (!clipUrl) {
      throw new Error('clip quality not found');
    }
    clipUrl = `${clipUrl}?sig=${clip.playbackAccessToken.signature}&token=${encodeURIComponent(clip.playbackAccessToken.value)}`;
    return clipUrl;
  }
}