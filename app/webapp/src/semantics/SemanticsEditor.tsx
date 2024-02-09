import { Box } from 'grommet';

import { ParserResult } from '../shared/types';
import { LoadingDiv } from '../ui-components/LoadingDiv';
import { Patterns } from './patterns/patterns';

const DEBUG = false;

export const SemanticsEditor = (props: {
  isLoading: boolean;
  parsed?: ParserResult;
}) => {
  if (props.isLoading || !props.parsed) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <Box style={{ width: '100%' }}>
      {props.parsed ? <Patterns parsed={props.parsed}></Patterns> : <></>}
    </Box>
  );
};
