import 'dotenv/config';

export const env = {
  clientSecret: process.env['CLIENT_SECRET'],
  clientId: process.env['CLIENT_ID'],
  port: process.env['PORT'],
  authPort: process.env['AUTH_PORT'],
  appName: process.env['APP_NAME']
};

if (!env.clientId || !env.clientSecret || !env.port || !env.appName || !env.authPort) {
  throw new Error('missing env variables');
}