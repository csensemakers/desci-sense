import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppPostGetSemantics } from '../../@shared/types';
import { getPostSemantics } from '../posts.service';
import { getPostSemanticsValidationScheme } from './posts.schemas';

export const getPostSemanticsController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = (request as any).userId;
    if (!userId) {
      response.status(403).send({});
      return;
    }
    const payload = (await getPostSemanticsValidationScheme.validate(
      request.body
    )) as AppPostGetSemantics;

    const semantics = await getPostSemantics(payload.content);

    response.status(200).send({ success: true, semantics });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
