import { getPostSemantics } from '../src/post/post.utils';

describe('test', () => {
  it('works', async () => {
    const content = 'This is a post';
    const result = await getPostSemantics(content, '');
    console.log({ result });
  });
});
