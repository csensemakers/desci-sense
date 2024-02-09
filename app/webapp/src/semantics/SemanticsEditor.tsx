import { Box } from 'grommet';

import { ParserResult } from '../shared/types';
import { LoadingDiv } from '../ui-components/LoadingDiv';
import { PatternProps, Patterns } from './patterns/patterns';

const DEBUG = false;

export const SemanticsEditor = (props: {
  isLoading: boolean;
  parsed?: ParserResult;
  semanticsUpdated?: PatternProps['semanticsUpdated'];
}) => {
  if (props.isLoading || !props.parsed) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <Box style={{ width: '100%' }} pad={{ vertical: 'large' }}>
      {props.parsed ? (
        <Patterns
          parsed={props.parsed}
          semanticsUpdated={props.semanticsUpdated}></Patterns>
      ) : (
        <></>
      )}
    </Box>
  );
};
