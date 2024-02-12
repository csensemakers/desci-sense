import { Box } from 'grommet';

import { AppPostSemantics, ParserResult } from '../shared/types';
import { LoadingDiv } from '../ui-components/LoadingDiv';
import { PatternProps, Patterns } from './patterns/patterns';

const DEBUG = false;

export const SemanticsEditor = (props: {
  isLoading: boolean;
  originalParsed?: ParserResult;
  semantics?: AppPostSemantics;
  semanticsUpdated?: PatternProps['semanticsUpdated'];
}) => {
  if (props.isLoading || !props.originalParsed) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <Box style={{ width: '100%' }} pad={{ vertical: 'large' }}>
      <Patterns {...props}></Patterns>
    </Box>
  );
};
