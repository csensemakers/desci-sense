import { Nanopub } from '@nanopub/sign';
import { logger } from 'firebase-functions/v1';

import { AppPostCreate, PLATFORM, TweetRead } from '../@shared/types';
import { FUNCTIONS_PY_URL, IS_TEST } from '../config/config';
import { createPost } from '../db/posts.repo';
import { constructTweet } from '../twitter/construct.tweet';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { TAG_OPTIONS } from './TAG_OPTIONS';

export const publishPost = async (userId: string, post: AppPostCreate) => {
  let tweet: TweetRead | undefined = undefined;

  const nanopub = post.signedNanopub
    ? new Nanopub(post.signedNanopub)
    : undefined;
  const nanopubInfo = nanopub ? nanopub.info() : undefined;

  if (post.platforms.includes(PLATFORM.X)) {
    const tweetContent = await constructTweet(post, nanopubInfo);
    if (IS_TEST) {
      tweet = { id: 'dummyurl', text: tweetContent };
      logger.debug('skipping publish', { tweet });
    } else {
      tweet = await postMessageTwitter(userId, tweetContent);
    }
  }

  const createdPost = await createPost({
    ...post,
    author: userId,
    tweet,
  });

  if (nanopubInfo) {
    createdPost.nanopub = nanopubInfo;
  }

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
