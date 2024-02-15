import { Box } from 'grommet';
import { useMemo } from 'react';

import { AppPostSemantics } from '../../../shared/parser.types';
import { Triplet } from '../../../shared/types';
import { parseTriplet } from '../../../shared/utils';
import { PatternProps } from '../patterns';
import { RefLabel } from './RefLabel';
import { RefsMap, processTriplets } from './process.triplets';

export const RefLabelsComponent = (props: PatternProps) => {
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

  const removeLabel = (ref: string, labelUri: string) => {
    if (props.semanticsUpdated && semantics) {
      const newTriplets = [...semantics.triplets];
      const ix = newTriplets.findIndex((triplet) => {
        const parts = parseTriplet(triplet);
        return parts[1] === labelUri && parts[2] === ref;
      });

      if (ix === -1) {
        throw new Error(`Unexpected labelUri ${labelUri} not found`);
      }

      newTriplets.splice(ix, 1);
      props.semanticsUpdated({ triplets: newTriplets });
    }
  };

  const addLabel = (ref: string, labelUri: string) => {
    if (props.semanticsUpdated && semantics) {
      if (
        /** prevent duplicates */
        triplets.find(
          (triplet) => triplet[1] === labelUri && triplet[2] === ref
        ) === undefined
      ) {
        props.semanticsUpdated({
          triplets: semantics.triplets.concat([`<_:1> <${labelUri}> <${ref}>`]),
        });
      }
    }
  };

  if (!props.originalParsed) {
    return <></>;
  }

  if (refs && refs.size > 0) {
    return (
      <Box margin={{ top: 'small' }}>
        <Box style={{ display: 'block' }}>
          <Box gap="large">
            {Array.from(refs.entries()).map(([ref, refData], ixref) => {
              if (!props.originalParsed)
                throw new Error('Undexpected undefined');

              return (
                <RefLabel
                  key={ixref}
                  refData={refData}
                  support={props.originalParsed.support.refLabels}
                  removeLabel={(labelUri: string) => removeLabel(ref, labelUri)}
                  addLabel={(labelUri: string) =>
                    addLabel(ref, labelUri)
                  }></RefLabel>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  }

  return <></>;
};
