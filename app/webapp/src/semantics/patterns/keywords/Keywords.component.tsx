import { Box } from 'grommet';

import { AppLabelsEditor } from '../../../ui-components/AppLabelsEditor';
import { useThemeContext } from '../../../ui-components/ThemedApp';
import { parseTriplet } from '../../utils';
import { PatternProps } from '../patterns';

const HAS_KEYWORD_PREDICATE = 'has-keyword';

export const KeywordsComponent = (props: PatternProps) => {
  const { constants } = useThemeContext();

  const triplets = props.parsed.semantics.triplets.map((t) => parseTriplet(t));

  const addKeyword = (keyword: string) => {
    if (props.semanticsUpdated) {
      props.semanticsUpdated({
        triplets: props.parsed.semantics.triplets.concat([
          `<_:1> <${HAS_KEYWORD_PREDICATE}> <${keyword}>`,
        ]),
      });
    }
  };

  const removeKeyword = (keyword: string) => {
    if (props.semanticsUpdated) {
      const newTriplets = [...props.parsed.semantics.triplets];
      const ix = newTriplets.findIndex((triplet) => {
        const parts = parseTriplet(triplet);
        return parts[1] === HAS_KEYWORD_PREDICATE && parts[2] === keyword;
      });

      if (ix === -1) {
        throw new Error(`Unexpected keyword ${keyword} not found`);
      }

      newTriplets.splice(ix, 1);
      props.semanticsUpdated({ triplets: newTriplets });
    }
  };

  const keywords = triplets
    .filter((t) => t[1] === HAS_KEYWORD_PREDICATE)
    .map((t) => t[2]);

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
