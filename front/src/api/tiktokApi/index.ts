


const uploadVideoChunk = async (uploadUrl: string, chunkSize: number, firstByte: number, totalBytes: number, body: BodyInit) => {
  const resp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      // TODO - check last byte
      'Content-Range': `bytes ${firstByte}-${firstByte + chunkSize - 1}/${totalBytes}`,
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'video/webm'
    },
    body
  });
  return resp.ok;
}; 

export const TiktokApi = {
  uploadVideoChunk
};