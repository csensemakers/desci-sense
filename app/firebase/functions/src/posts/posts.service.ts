import { logger } from 'firebase-functions/v1';

import { AppPostCreate, PLATFORM, TweetRead } from '../@shared/types';
import { FUNCTIONS_PY_URL } from '../config/config';
import { createPost } from '../db/posts.repo';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { TAG_OPTIONS } from './TAG_OPTIONS';

export const postPost = async (userId: string, post: AppPostCreate) => {
  let tweet: TweetRead | undefined = undefined;

  if (post.platforms.includes(PLATFORM.X)) {
    const append = post.semantics?.tags
      ? '\n\n' + post.semantics.tags.map((tag: string) => `#${tag}`).join(' ')
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

  const semantics = body.semantics;
  logger.debug('getPostSemantics', semantics);

  return semantics;
};
