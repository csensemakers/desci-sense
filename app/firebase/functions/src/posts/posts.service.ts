import { Nanopub, NpProfile } from '@nanopub/sign';
import * as crypto from 'crypto';
import { logger } from 'firebase-functions/v1';

import {
  AppPostCreate,
  AppUserRead,
  PLATFORM,
  TweetRead,
} from '../@shared/types';
import { FUNCTIONS_PY_URL, IS_TEST, NANOPUB_SERVER } from '../config/config';
import { createPost } from '../db/posts.repo';
import { constructNanopub } from '../nanopubs/construct.nanopub';
import { constructTweet } from '../twitter/construct.tweet';
import { postMessageTwitter } from '../twitter/twitter.utils';
import { TAG_OPTIONS } from './TAG_OPTIONS';

export const publishPost = async (userId: string, post: AppPostCreate) => {
  let nanopub: Nanopub | undefined;
  if (post.platforms.includes(PLATFORM.Nanopubs)) {
    try {
      const user: AppUserRead = {
        userId: 'dummy',
      };

      const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      const keyBody = keys.privateKey
        .replace(/-----BEGIN PRIVATE KEY-----\n?/, '')
        .replace(/\n?-----END PRIVATE KEY-----/, '')
        .replace(/\n/g, '');

      const profile = new NpProfile(
        keyBody,
        'https://orcid.org/0000-0000-0000-0000',
        'Your Name',
        ''
      );

      nanopub = await constructNanopub(post, user);
      nanopub = await nanopub.publish(profile, NANOPUB_SERVER);
    } catch (e) {
      nanopub = undefined;
      logger.error(e);
    }
  }

  let tweet: TweetRead | undefined = undefined;
  if (post.platforms.includes(PLATFORM.X)) {
    const tweetContent = constructTweet(post, nanopub);
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
    nanopub: nanopub?.info(),
  });

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
