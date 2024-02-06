import express from 'express';
import * as functions from 'firebase-functions';

import { RUNTIME_OPTIONS } from '../config/RUNTIME_OPTIONS';
import { REGION } from '../config/config';
import { app } from '../instances/app';
import { getPostMetaController } from './controllers/getPostMeta.controller';
import { postController } from './controllers/posts.controller';

const postsRouter = express.Router();

postsRouter.post('/post', postController);
postsRouter.post('/getMeta', getPostMetaController);

export const postsApp = functions
  .region(REGION)
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(postsRouter));
