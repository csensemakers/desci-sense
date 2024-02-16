import { Box } from 'grommet';
import { useEffect } from 'react';

import { constructNanopub } from '../nanopubs/construct.nanopub';
import { getPostSemantics } from '../post/post.utils';

export const AppTest = (props: {}) => {
  const start = async () => {
    const content = 'A text';
    const parsed = await getPostSemantics(content, 'dummy');
    const nanopub = await constructNanopub(
      content,
      parsed.semantics,
      '0000-1234'
    );

    console.log({ content, parsed, nanopub });
  };
  useEffect(() => {
    start();
  });

  return <Box>Testing</Box>;
};
