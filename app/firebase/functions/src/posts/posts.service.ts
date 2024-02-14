import { logger } from 'firebase-functions/v1';

import { AppPostCreate, PLATFORM, TweetRead } from '../@shared/types';
import { FUNCTIONS_PY_URL, IS_TEST } from '../config/config';
import { createPost } from '../db/posts.repo';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { constructTweet } from '../twitter/construct.tweet';
import { constructNanopub } from '../nanopubs/construct.nanopub';

import { TAG_OPTIONS } from './TAG_OPTIONS';

export const publishPost = async (userId: string, post: AppPostCreate) => {
  let nanopub;
  if (post.platforms.includes(PLATFORM.Nanopubs)) {
    nanopub = await constructNanopub(post);
  }
  
  let tweet: TweetRead | undefined = undefined;
  if (post.platforms.includes(PLATFORM.X)) {
    const tweetContent = constructTweet(post);
    if (IS_TEST) {
      tweet = {id: 'dummyurl', text: tweetContent}
      logger.debug('skipping publish', {tweet})
    } else {
      tweet = await postMessageTwitter(userId, tweetContent);
    }
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
