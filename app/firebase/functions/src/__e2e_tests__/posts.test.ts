import { HttpConnector } from './http.connector';

/** initialize firebase admin in test mode */
import './index.test';
import { getSemantics } from './utils/posts';

describe('posts', () => {
  const http = new HttpConnector('dummy');

  before(async () => {});

  it('create', async () => {
    const content = 'A post';
    const res = await getSemantics(content, http);
    console.log({ res });
  });
});
