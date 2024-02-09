import { Box, Text } from 'grommet';

import { parseTriplet } from '../../utils';
import { RefCard } from '../common/RefCard';
import { PatternProps } from '../patterns';
import { RefsMap } from './types';

export const RefLabelsComponent = (props: PatternProps) => {
  const triplets = props.parsed.semantics.triplets.map((t) => parseTriplet(t));

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

  if (labeled.length > 0) {
    return (
      <Box margin={{ top: 'small' }}>
        <Box style={{ display: 'block' }}>
          <Box gap="medium">
            {Array.from(refs.entries()).map(([ref, semantics], ixref) => {
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
                <Box key={ixref}>
                  <Box direction="row">
                    {/* <Text margin={{ right: 'xsmall' }}>This post</Text> */}
                    {labelsElements}
                  </Box>
                  <RefCard
                    reference={ref}
                    support={props.parsed.support}></RefCard>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  }

  return <></>;
};
