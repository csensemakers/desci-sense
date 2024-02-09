import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';

import { parseTriplet } from '../../utils';
import { PatternProps } from '../patterns';

export const KeywordsComponent = (props: PatternProps) => {
  const { t } = useTranslation();

  const triplets = props.parsed.semantics.triplets.map((t) => parseTriplet(t));

  const keywords = triplets
    .filter((t) => t[1] === 'has-keyword')
    .map((t) => t[2]);

  return (
    <Box>
      <Box style={{ display: 'block' }}>
        {keywords.map((keyWord, ix) => {
          return (
            <Box style={{ float: 'left' }}>
              <Text
                style={{ fontWeight: 'bold' }}
                key={ix}>{`#${keyWord}`}</Text>
            </Box>
          );
        })}
        <Box>
          <Text>{t('addKeyword')}</Text>
        </Box>
      </Box>
    </Box>
  );
};
