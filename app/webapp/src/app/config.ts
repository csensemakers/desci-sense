export const DEBUG = true;

export const FUNCTIONS_BASE = process.env.FUNCTIONS_BASE;

export const ORCID_CLIENT_ID = process.env.ORCID_CLIENT_ID;
export const ORCID_API_URL = 'https://orcid.org';
export const APP_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3000/'
    : 'https://split--sensemakers.netlify.app/';

export const ORCID_REDIRECT_URL = APP_URL;

export const TWITTER_API_URL = 'https://api.twitter.com';
export const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
