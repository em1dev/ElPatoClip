
export const readBlob = async (response: Response, onUpdate: (progress: number, total: number) => void) => {
  const data = await readUint8Array(response, onUpdate);
  return new Blob([data]);
}

export const readString = async (response: Response, onUpdate: (progress: number, total: number) => void) => {
  const data = await readUint8Array(response, onUpdate);
  return new TextDecoder('utf-8').decode(data);
}

const readUint8Array = async (response:Response, onUpdate: (progress: number, total: number) => void) => {
  if (!response.body) throw new Error('no body was found');
  const reader = response.body.getReader();

  const contentLength = response.headers.get('content-length') ?? '0'; 

  let total = Number.parseInt(contentLength)
  total = isNaN(total) ? 0 : total;
  onUpdate(0, total);

  let received = 0;
  const chunks:Array<Uint8Array> = [];
  let loading = true;

  while (loading) {
    const { done, value } = await reader.read();
    if (done) {
      loading = false;
      continue;
    }

    chunks.push(value);
    received += value.length; 
    onUpdate(received, total);
  }

  const body = new Uint8Array(received);
  let position = 0;

  for (const chunk of chunks) {
    body.set(chunk, position);
    position += chunk.length;
  }

  return body
}