import 'dotenv/config';

export const env = {
  clientSecret: process.env['CLIENT_SECRET']!,
  clientId: process.env['CLIENT_ID']!,
  port: process.env['PORT']!
};

if (!env.clientId || !env.clientSecret || !env.port) {
  throw new Error('missing env variables');
}