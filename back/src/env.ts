import 'dotenv/config';

export const env = {
  clientSecret: process.env['CLIENT_SECRET']!,
  clientId: process.env['CLIENT_ID']!
};

if (!env.clientId || !env.clientSecret) {
  throw new Error('missing env variables');
}