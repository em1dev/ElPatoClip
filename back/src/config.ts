import 'dotenv/config';

export const config = {
  PORT: process.env['PORT'],
  AUTH_URL: process.env['AUTH_URL'],
  APP_ID: process.env['APP_ID']
};

if (!config.PORT || !config.APP_ID || !config.AUTH_URL) {
  throw new Error('missing env variables');
}
