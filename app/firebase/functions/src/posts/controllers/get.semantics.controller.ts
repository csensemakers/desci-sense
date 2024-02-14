import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import * as mockResult from '../../../sample.result.json';
import { AppPostGetSemantics } from '../../@shared/types';
import { MOCK_SEMANTICS } from '../../config/config';
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

    const result = !MOCK_SEMANTICS
      ? await getPostSemantics(payload.content)
      : mockResult;

    response.status(200).send({ success: true, result });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
