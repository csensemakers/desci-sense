import { Box } from 'grommet';
import { useMemo } from 'react';

import { ParserResult } from '../../../shared/types';
import { AppLabel } from '../../../ui-components';
import { useThemeContext } from '../../../ui-components/ThemedApp';
import { parseTriplet } from '../../utils';
import { RefCard } from '../common/RefCard';
import { PatternProps } from '../patterns';
import { RefsMap } from './types';

export const RefLabelsComponent = (props: PatternProps) => {
  const { constants } = useThemeContext();

  /** actual semantics */
  const semantics = useMemo(() => {
    if (props.semantics) {
      return props.semantics;
    }
    if (props.originalParsed) {
      return props.originalParsed.semantics;
    }
  }, [props.originalParsed, props.semantics]);

  /** parsed triplets */
  const triplets = useMemo(
    () => (semantics ? semantics.triplets.map((t) => parseTriplet(t)) : []),
    [semantics]
  );

  /** ref labels
   * TODO: For now anything that is not a keyword is a ref label
   */
  const labeled = useMemo(
    () =>
      triplets
        ? triplets.filter((triplet) => triplet[1] !== 'has-keyword')
        : [],
    [triplets]
  );

  if (!props.originalParsed) {
    return <></>;
  }

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
          <Box gap="large">
            {Array.from(refs.entries()).map(([ref, semantics], ixref) => {
              const labels = semantics.labels;

              const labelsElements = labels.map((label, ixlabel) => {
                const hasMany = labels.length > 1;
                const isLast = ixlabel === labels.length - 1;

                return (
                  <AppLabel
                    key={ixlabel}
                    margin={{
                      right: 'xsmall',
                    }}>
                    {`${hasMany && isLast ? 'and ' : ''}${label}${hasMany && !isLast ? ',' : ''}`}
                  </AppLabel>
                );
              });

              return (
                <Box
                  key={ixref}
                  style={{
                    borderLeft: '4px solid',
                    borderColor: constants.colors.backgroundLightDarker,
                  }}
                  pad={{ left: 'medium', vertical: 'small' }}>
                  <Box direction="row" margin={{ bottom: 'small' }}>
                    {/* <Text margin={{ right: 'xsmall' }}>This post</Text> */}
                    {labelsElements}
                  </Box>
                  <RefCard
                    reference={ref}
                    support={
                      (props.originalParsed as ParserResult).support
                    }></RefCard>
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
