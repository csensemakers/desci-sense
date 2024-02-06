import { FUNCTIONS_BASE } from '../app/config';
import { AppPostCreate } from '../types';

export const postMessage = async (
  post: AppPostCreate,
  appAccessToken: string
) => {
  const res = await fetch(FUNCTIONS_BASE + '/posts/post', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: JSON.stringify(post),
  });

  const body = await res.json();
  return body.post;
};

export const getPostMeta = async (content: string, appAccessToken: string) => {
  const res = await fetch(FUNCTIONS_BASE + '/posts/getMeta', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  const body = await res.json();
  return body.post;
};
