import { Anchor, Box, Text } from 'grommet';

import { ParserResult } from '../../../shared/types';
import { parseTriplet } from '../../utils';
import { Pattern } from '../types';
import { RefsMap } from './types';

export const refLabelsPattern: Pattern = (parsed: ParserResult) => {
  const triplets = parsed.semantics.triplets.map((t) => parseTriplet(t));

  const labeled = triplets.filter((triplet) => triplet[1] !== 'has-keyword');

  const refs: RefsMap = new Map();

  for (const triplet of labeled) {
    const label = triplet[1];
    const ref = triplet[2];
    const current = refs.get(ref);
    refs.set(
      ref,
      current
        ? { ...current, labels: current.labels.concat(label) }
        : { labels: [label] }
    );
  }

  const getRefTitle = (ref: string) => {
    const title = parsed?.support.refs.metadata[ref].title;
    return title;
  };

  if (labeled.length > 0) {
    return (
      <Box margin={{ top: 'small' }}>
        <Box style={{ display: 'block' }}>
          <Box>
            {Array.from(refs.entries()).map(([ref, semantics]) => {
              const labels = semantics.labels;

              const labelsElements = labels.map((label, ixlabel) => {
                const hasMany = labels.length > 1;
                const isLast = ixlabel === labels.length - 1;

                return (
                  <Text
                    key={ixlabel}
                    margin={{
                      right: 'xsmall',
                    }}>{`${hasMany && isLast ? 'and ' : ''}${label}${hasMany && !isLast ? ',' : ''}`}</Text>
                );
              });

              return (
                <Box>
                  <Box direction="row">{labelsElements}</Box>
                  <Anchor href={ref} target="_blank">
                    {getRefTitle(ref)}
                  </Anchor>
                </Box>
              );
            })}
          </Box>
          <Box></Box>
        </Box>
      </Box>
    );
  }

  return <></>;
};
