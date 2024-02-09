import { FUNCTIONS_BASE } from '../app/config';
import { AppPostCreate, ParserResult } from '../shared/types';

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

export const getPostSemantics = async (
  content: string,
  appAccessToken: string
): Promise<ParserResult> => {
  const res = await fetch(FUNCTIONS_BASE + '/posts/getSemantics', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  const body = await res.json();
  return body.result;
};
