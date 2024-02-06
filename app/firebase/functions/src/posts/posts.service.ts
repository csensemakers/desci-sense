import { logger } from 'firebase-functions/v1';

import { AppPostCreate, PLATFORM, TweetRead } from '../@shared/types';
import { FUNCTIONS_PY_URL } from '../config/config';
import { createPost } from '../db/posts.repo';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { TAG_OPTIONS } from './TAG_OPTIONS';

export const postPost = async (userId: string, post: AppPostCreate) => {
  let tweet: TweetRead | undefined = undefined;

  if (post.platforms.includes(PLATFORM.X)) {
    const newContent =
      post.content +
      '\n\n' +
      post.meta.tags.map((tag: string) => `#${tag}`).join(' ');

    tweet = await postMessageTwitter(userId, newContent);
  }

  const createdPost = await createPost({ ...post, author: userId, tweet });

  return createdPost;
};

export const getPostMeta = async (content: string) => {
  const parameters = { options: TAG_OPTIONS };

  const response = await fetch(`${FUNCTIONS_PY_URL}/SM_FUNCTION_post_tagger`, {
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/json'],
    ],
    method: 'post',
    body: JSON.stringify({ content, parameters }),
  });

  const body = await response.json();

  const meta = body.meta;
  logger.debug('getPostMeta', meta);

  return meta;
};
