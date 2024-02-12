import { Box } from 'grommet';
import { useMemo } from 'react';

import { AppPostSemantics, ParserResult } from '../../../shared/parser.types';
import { Triplet } from '../../../shared/types';
import { parseTriplet } from '../../../shared/utils';
import { AppLabel } from '../../../ui-components';
import { useThemeContext } from '../../../ui-components/ThemedApp';
import { RefCard } from '../common/RefCard';
import { PatternProps } from '../patterns';
import { RefsMap, processTriplets } from './process.triplets';

export const RefLabelsComponent = (props: PatternProps) => {
  const { constants } = useThemeContext();

  /** actual semantics */
  const semantics = useMemo<AppPostSemantics | undefined>(() => {
    if (props.semantics) {
      return props.semantics;
    }
    if (props.originalParsed) {
      return props.originalParsed.semantics;
    }
  }, [props.originalParsed, props.semantics]);

  /** parsed triplets */
  const triplets = useMemo<Triplet[]>(
    () => (semantics ? semantics.triplets.map((t) => parseTriplet(t)) : []),
    [semantics]
  );

  /** processed ref labels with metadata */
  const refs = useMemo<RefsMap>(
    () =>
      triplets && props.originalParsed
        ? processTriplets(triplets, props.originalParsed.support.refLabels)
        : new Map(),
    [props.originalParsed, triplets]
  );

  if (!props.originalParsed) {
    return <></>;
  }

  if (refs && refs.size > 0) {
    return (
      <Box margin={{ top: 'small' }}>
        <Box style={{ display: 'block' }}>
          <Box gap="large">
            {Array.from(refs.values()).map((refData, ixref) => {
              const labelsElements = refData.labelsUris.map(
                (labelUri, ixlabel) => {
                  const hasMany = refData.labelsUris.length > 1;
                  const isLast = ixlabel === refData.labelsUris.length - 1;

                  const label_ontology = (
                    props.originalParsed as ParserResult
                  ).support.refLabels.labelsOntology.find(
                    (item) => item.URI === labelUri
                  );

                  if (!label_ontology)
                    throw new Error(
                      `Unexpected ontology not found for ${labelUri}`
                    );

                  return (
                    <AppLabel
                      key={ixlabel}
                      margin={{
                        right: 'xsmall',
                      }}>
                      {`${hasMany && isLast ? 'and ' : ''}${label_ontology.display_name}${hasMany && !isLast ? ',' : ''}`}
                    </AppLabel>
                  );
                }
              );

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
                    title={refData.meta?.title}
                    description={refData.meta?.title}
                    image={refData.meta?.image}></RefCard>
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
