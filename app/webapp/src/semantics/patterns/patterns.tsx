import { Box } from 'grommet';

import { ParserResult } from '../../shared/types';
import { keywordsPattern } from './keywords/keywords.pattern';
import { refLabelsPattern } from './refs-labels/ref-labels.pattern';
import { Pattern } from './types';

export const patternsLib: Pattern[] = [keywordsPattern, refLabelsPattern];
export const renderPatterns = (parsed: ParserResult) => {
  return patternsLib.map((pattern, ix) => (
    <Box key={ix}>{pattern(parsed)}</Box>
  ));
};
