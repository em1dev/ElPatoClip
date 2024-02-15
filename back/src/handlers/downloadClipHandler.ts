import { Response } from 'express';
import { TwitchGqlApi } from '../api/twitchGqlApi';
import { Readable } from 'stream';


export const downloadClipHandler = async (id: string, twitchGqlApi: TwitchGqlApi, res: Response) => {
    const url = await twitchGqlApi.getDownloadClipUrl(id);
    if (!url) {
      res.status(404);
      return;
    }
    const resp = await fetch(url);
    if (!resp.body) return;

    const reader = resp.body.getReader()
    const stream = new Readable({
      read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            this.push(null)
          } else {
            this.push(value)
          }
        })
      },
    })

    const contentLength = resp.headers.get('content-length')
    if (contentLength) {
      res.set('Content-Length', contentLength);
    }
    res.set("Content-Type", "video/mp4")
    res.set("Accept-Ranges", "bytes")
    res.set("Connection", "keep-alive")
    res.set("Cache-Control", "no-cache")
    stream.pipe(res)
}