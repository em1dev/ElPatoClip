import { app, handleError } from '../..';
import { PostVideoRequest, StatusResponse } from '../../api/tiktokApi/types';
import { initiateVideoUploadHandler } from './handlers/initiateVideoUploadHandler';
import { getUploadStatusHandler } from './handlers/getUploadStatusHandler';
import { getUserIdFromToken } from '../../getUserFromToken';
import { getCreatorPermissionsHandler } from './handlers/getCreatorPermissionsHandler';

app.post('/tiktok/initiate-upload', async (req, res) => {
  try {
    const videoData = (req.body as PostVideoRequest);

    const userId = await getUserIdFromToken(req.headers);
    if (!userId) return res.status(401).send();

    const result = await initiateVideoUploadHandler(videoData, userId);
    if (!result) return res.status(500).send('Unable to create video');

    return res.status(result.status).send(result.payload);
  } catch (e) {
    handleError(e, res);
  }
});

app.post('/tiktok/video/status', async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req.headers);
    if (!userId) return res.status(401).send();

    const videoId = req.body.id;
    if (videoId.length === 0) return res.status(400).send('Invalid video id');

    const statusResponse = await getUploadStatusHandler(userId, videoId);
    const data = await statusResponse.json() as StatusResponse;
    return res.status(statusResponse.status).send(data);

  } catch (e) {
    handleError(e, res);
  }
});

app.get('/tiktok/permissions', async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req.headers);
    if (!userId) return res.status(401).send();

    const data = await getCreatorPermissionsHandler(userId);
    if (!data) return res.status(500).send();
    res.status(200).send(data);

  } catch (e) {
    handleError(e, res);
  }
});