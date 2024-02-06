import { FUNCTIONS_BASE } from '../app/config';
import { AppUserRead } from '../types';

export const postOrcidCode = async (code: string) => {
  const res = await fetch(FUNCTIONS_BASE + '/auth/code', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  const body = await res.json();
  return body.token;
};

export const getTwitterAuthLink = async (appAccessToken: string) => {
  const res = await fetch(FUNCTIONS_BASE + '/auth/twitter-code', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: '',
  });

  const body = await res.json();
  return body.authLink;
};

export const postTwitterVerifierToken = async (
  appAccessToken: string,
  oauth: { oauth_token: string; oauth_verifier: string }
) => {
  const res = await fetch(FUNCTIONS_BASE + '/auth/twitter-verifier', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: JSON.stringify(oauth),
  });

  const body = await res.json();
  return body.twitter_user;
};

export const getLoggedUser = async (
  appAccessToken: string
): Promise<AppUserRead> => {
  const res = await fetch(FUNCTIONS_BASE + '/auth/me', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
  });

  const body = await res.json();
  return body.user;
};
