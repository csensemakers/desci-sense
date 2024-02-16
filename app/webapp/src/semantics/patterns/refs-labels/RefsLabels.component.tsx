import { Box } from 'grommet';
import { DataFactory } from 'n3';
import { useMemo } from 'react';

import { filterStore, writeRDF } from '../../../shared/n3.utils';
import { useSemanticsStore } from '../common/use.semantics';
import { PatternProps } from '../patterns';
import { RefLabel } from './RefLabel';
import { RefsMap, processSemantics } from './process.semantics';

export const RefLabelsComponent = (props: PatternProps) => {
  const store = useSemanticsStore(props);

  /** processed ref labels with metadata */
  const refs = useMemo<RefsMap>(
    () =>
      store && props.originalParsed
        ? processSemantics(store, props.originalParsed.support.refLabels)
        : new Map(),
    [props.originalParsed, store]
  );

  const removeLabel = async (ref: string, labelUri: string) => {
    if (props.semanticsUpdated && store) {
      const newStore = filterStore(
        store,
        () => true,
        null,
        labelUri,
        ref,
        null
      );
      const newSemantics = await writeRDF(newStore);
      if (!newSemantics) throw new Error('Unexpected');
      props.semanticsUpdated(newSemantics);
    }
  };

  const addLabel = async (ref: string, labelUri: string) => {
    if (props.semanticsUpdated && store) {
      const THIS_POST = DataFactory.blankNode('<:this-text>');
      const labelNode = DataFactory.namedNode(labelUri);
      const refNode = DataFactory.namedNode(ref);

      store.addQuad(
        DataFactory.quad(
          THIS_POST,
          labelNode,
          refNode,
          DataFactory.defaultGraph()
        )
      );

      const newSemantics = await writeRDF(store);
      if (!newSemantics) throw new Error('Unexpected');
      props.semanticsUpdated(newSemantics);
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
