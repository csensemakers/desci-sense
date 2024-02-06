import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppPostGetMeta } from '../../@webapp/types';
import { getPostMeta } from '../posts.service';
import { getPostMetaValidationScheme } from './posts.schemas';

export const getPostMetaController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = (request as any).userId;
    if (!userId) {
      response.status(403).send({});
      return;
    }
    const payload = (await getPostMetaValidationScheme.validate(
      request.body
    )) as AppPostGetMeta;

    const post = await getPostMeta(payload.content);

    response.status(200).send({ success: true, post });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
