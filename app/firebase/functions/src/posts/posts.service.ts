import { Nanopub, NpProfile } from '@nanopub/sign';
import { logger } from 'firebase-functions/v1';

import {
  AppPostCreate,
  AppUserRead,
  PLATFORM,
  TweetRead,
} from '../@shared/types';
import { FUNCTIONS_PY_URL, IS_TEST } from '../config/config';
import { createPost } from '../db/posts.repo';
import { constructNanopub } from '../nanopubs/construct.nanopub';
import { constructTweet } from '../twitter/construct.tweet';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { TAG_OPTIONS } from './TAG_OPTIONS';

export const publishPost = async (userId: string, post: AppPostCreate) => {
  let nanopub: Nanopub;
  if (post.platforms.includes(PLATFORM.Nanopubs)) {
    const user: AppUserRead = {
      userId: 'dummy',
    };

    const privateKey = '';
    const profile = new NpProfile(
      privateKey,
      'https://orcid.org/0000-0000-0000-0000',
      'Your Name',
      ''
    );

    nanopub = await constructNanopub(post, user);
    const signed = nanopub.sign(profile);

    console.log({ signed });
    // await publishNanopub(nanopub);
  }

  let tweet: TweetRead | undefined = undefined;
  if (post.platforms.includes(PLATFORM.X)) {
    const tweetContent = constructTweet(post);
    if (IS_TEST) {
      tweet = { id: 'dummyurl', text: tweetContent };
      logger.debug('skipping publish', { tweet });
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
