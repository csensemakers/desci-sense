import { Anchor, Box, Text } from 'grommet';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppPostSemantics } from '../shared/types';
import { LoadingDiv } from '../ui-components/LoadingDiv';

const DEBUG = true;

export const SemanticsEditor = (props: {
  isLoading: boolean;
  semantics?: AppPostSemantics;
}) => {
  const { t } = useTranslation();

  const triplets = useMemo(() => {
    if (!props.semantics) {
      return [];
    }

    const regex = /<([^>]+)>/g;

    return props.semantics.triplets.map((triplet) => {
      const parts = triplet.match(regex);
      if (!parts) throw new Error(`Unexpected triplet ${triplet}`);

      return parts.map((part) => part.slice(1, -1));
    });
  }, [props.semantics]);

  const keywords = triplets.filter((triplet) => triplet[1] === 'has-keyword');
  const refLabels = triplets.filter((triplet) => triplet[1] !== 'has-keyword');
  const ref = refLabels.length ? refLabels[0][2] : undefined;

  if (props.isLoading || !props.semantics) {
    return <LoadingDiv></LoadingDiv>;
  }

  if (DEBUG) {
    console.log({ semantics: props.semantics, triplets, keywords });
  }

  return (
    <Box>
      {keywords.length ? (
        <Box>
          <Box style={{ display: 'block' }}>
            {keywords.map((keyWord, ix) => {
              return (
                <Text
                  style={{ fontWeight: 'bold' }}
                  key={ix}>{`#${keyWord[2]}`}</Text>
              );
            })}
          </Box>
        </Box>
      ) : (
        <></>
      )}
      {ref ? (
        <Box margin={{ top: 'small' }}>
          <Box style={{ display: 'block' }}>
            <Box direction="row">
              <Text>{`This post`}</Text>
              {refLabels.map((label, ix) => {
                return (
                  <Text
                    key={ix}
                    margin={{
                      left: 'xsmall',
                    }}>{`${refLabels.length > 0 && ix === refLabels.length - 1 ? 'and ' : ''} ${label[1]}${ix < refLabels.length && refLabels.length > 1 ? `,` : ''}`}</Text>
                );
              })}
            </Box>
            <Box>
              <Anchor href={ref} target="_blank">{`this ref`}</Anchor>
            </Box>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
