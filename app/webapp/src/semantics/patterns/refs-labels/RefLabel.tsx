import { Box } from 'grommet';
import { useMemo } from 'react';

import { ReflabelsSupport } from '../../../shared/parser.types';
import { AppLabelsEditor } from '../../../ui-components/AppLabelsEditor';
import { useThemeContext } from '../../../ui-components/ThemedApp';
import { RefCard } from '../common/RefCard';
import { RefData } from './process.semantics';

const DEBUG = true;

/** renders the labels for one ref */
export const RefLabel = (props: {
  refData: RefData;
  support: ReflabelsSupport;
  addLabel: (labelUri: string) => void;
  removeLabel: (labelUri: string) => void;
}) => {
  const labelsOntology = props.support.labelsOntology;
  const refData = props.refData;

  const { constants } = useThemeContext();

  /** display names for selected labels */
  const labelsDisplayNames = useMemo(
    () =>
      refData.labelsUris.map((labelUri) => {
        const label_ontology = labelsOntology.find(
          (item) => item.URI === labelUri
        );

        if (!label_ontology)
          throw new Error(`Unexpected ontology not found for ${labelUri}`);

        return label_ontology.display_name as string;
      }),
    [labelsOntology, refData.labelsUris]
  );

  /** list of possible labels from ontology (filtering thoase selected) */
  const optionDisplayNames = useMemo(
    () =>
      labelsOntology
        .filter((l) => !refData.labelsUris.includes(l.URI))
        .map((l) => l.display_name),
    [labelsOntology, refData.labelsUris]
  );

  const getLabelFromDisplayName = (displayName: string) => {
    const item = labelsOntology.find((l) => l.display_name === displayName);
    if (!item)
      throw new Error(
        `Unexpected label with display_name equal to ${displayName} not found`
      );
    return item;
  };

  /** converts display name into label uri and calls its removal */
  const removeLabel = (label: string) => {
    props.removeLabel(getLabelFromDisplayName(label).URI);
  };

  /** converts display name into label uri and calls its addition */
  const addLabel = (label: string) => {
    props.addLabel(getLabelFromDisplayName(label).URI);
  };

  return (
    <Box
      style={{
        borderLeft: '4px solid',
        borderColor: constants.colors.backgroundLightDarker,
      }}
      pad={{ left: 'medium', vertical: 'small' }}>
      <Box direction="row" margin={{ bottom: 'small' }}>
        <AppLabelsEditor
          labels={labelsDisplayNames}
          options={optionDisplayNames}
          removeLabel={(label) => removeLabel(label)}
          addLabel={(label) => addLabel(label)}></AppLabelsEditor>
      </Box>
      <RefCard
        title={refData.meta?.title}
        description={refData.meta?.title}
        image={refData.meta?.image}></RefCard>
    </Box>
  );
};
