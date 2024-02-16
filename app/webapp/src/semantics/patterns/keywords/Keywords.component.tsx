import { Box } from 'grommet';
import { DataFactory } from 'n3';
import { useMemo } from 'react';

import {
  filterStore,
  mapStoreElements,
  writeRDF,
} from '../../../shared/n3.utils';
import { AppLabelsEditor } from '../../../ui-components/AppLabelsEditor';
import { useThemeContext } from '../../../ui-components/ThemedApp';
import { useSemanticsStore } from '../common/use.semantics';
import { PatternProps } from '../patterns';

export const KeywordsComponent = (props: PatternProps) => {
  const { constants } = useThemeContext();

  /** actual semantics */
  const store = useSemanticsStore(props);

  const KEYWORD_PREDICATE =
    props.originalParsed?.support.keywords.keyWordsOntology.URI;

  const keywords = useMemo<string[]>(() => {
    if (!store) return [];
    return mapStoreElements<string>(
      store,
      (quad) => quad.object.value,
      null,
      KEYWORD_PREDICATE
    );
  }, [KEYWORD_PREDICATE, store]);

  const addKeyword = async (keyword: string) => {
    if (props.semanticsUpdated && store && KEYWORD_PREDICATE) {
      const THIS_POST = DataFactory.blankNode('<:this-text>');
      const labelNode = DataFactory.namedNode(KEYWORD_PREDICATE);
      const refNode = DataFactory.literal(keyword);

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

  const removeKeyword = async (keyword: string) => {
    if (props.semanticsUpdated && store) {
      const newStore = filterStore(
        store,
        () => true,
        null,
        KEYWORD_PREDICATE,
        keyword,
        null
      );
      const newSemantics = await writeRDF(newStore);
      if (!newSemantics) throw new Error('Unexpected');
      props.semanticsUpdated(newSemantics);
    }
  };

  return (
    <Box
      direction="row"
      style={{
        borderLeft: '4px solid',
        borderColor: constants.colors.backgroundLightDarker,
      }}
      pad={{ left: 'medium' }}>
      <Box
        style={{
          flexGrow: 1,
        }}
        direction="row">
        <AppLabelsEditor
          labels={keywords}
          addLabel={(newLabel) => addKeyword(newLabel)}
          removeLabel={(newLabel) => removeKeyword(newLabel)}></AppLabelsEditor>
      </Box>
    </Box>
  );
};
