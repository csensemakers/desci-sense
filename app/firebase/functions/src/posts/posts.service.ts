import { logger } from 'firebase-functions/v1';

import { AppPostCreate, PLATFORM, TweetRead } from '../@shared/types';
import { FUNCTIONS_PY_URL } from '../config/config';
import { createPost } from '../db/posts.repo';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { TAG_OPTIONS } from './TAG_OPTIONS';

export const postPost = async (userId: string, post: AppPostCreate) => {
  let tweet: TweetRead | undefined = undefined;

  if (post.platforms.includes(PLATFORM.X)) {
    if (!post.parsed) throw new Error('Unexpected for now parsed undefined');

    const append = post.parsed.semantics.triplets
      ? '\n\n' + post.parsed.semantics.triplets.map((tag: string) => `#${tag}`).join(' ')
      : '';
    const newContent = post.content + append;

    tweet = await postMessageTwitter(userId, newContent);
  }

  const createdPost = await createPost({ ...post, author: userId, tweet });

  return createdPost;
};

export const getPostSemantics = async (content: string) => {
  const parameters = { options: TAG_OPTIONS };

  const response = await fetch(`${FUNCTIONS_PY_URL}/SM_FUNCTION_post_parser`, {
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/json'],
    ],
    method: 'post',
    body: JSON.stringify({ content, parameters }),
  });

  const body = await response.json();

  logger.debug('getPostSemantics', body);

  return body;
};
