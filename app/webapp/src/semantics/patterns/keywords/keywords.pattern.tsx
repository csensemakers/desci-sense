import { Box, Text } from 'grommet';

import { ParserResult } from '../../../shared/types';
import { parseTriplet } from '../../utils';
import { Pattern } from '../types';

export const keywordsPattern: Pattern = (parsed: ParserResult) => {
  const triplets = parsed.semantics.triplets.map((t) => parseTriplet(t));

  const keywords = triplets
    .filter((t) => t[1] === 'has-keyword')
    .map((t) => t[2]);

  if (keywords.length > 0) {
    return (
      <Box>
        <Box style={{ display: 'block' }}>
          {keywords.map((keyWord, ix) => {
            return (
              <Text
                style={{ fontWeight: 'bold' }}
                key={ix}>{`#${keyWord}`}</Text>
            );
          })}
        </Box>
      </Box>
    );
  }

  return <></>;
};
