import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { verifyAccessToken } from '../auth/controllers/utils';

export const authenticate: RequestHandler = async (request, response, next) => {
  if (!request.headers.authorization) {
    logger.debug('Unauthenticated request');
    return next();
  }

  try {
    const parts = request.headers.authorization.split(' ');
    const token = parts[1];
    logger.debug('Authenticated request', { token: token.slice(0, 8) });
    const userId = verifyAccessToken(token);
    logger.debug('Authenticated request', { userId });

    (request as any).userId = userId;

    return next();
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
