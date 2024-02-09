import { Anchor, Box, Text } from 'grommet';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ParserResult, PostSemanticsStructured } from '../shared/types';
import { LoadingDiv } from '../ui-components/LoadingDiv';
import { parseTriplets } from './utils';

const DEBUG = true;

export const SemanticsEditor = (props: {
  isLoading: boolean;
  parsed?: ParserResult;
}) => {
  const { t } = useTranslation();

  const semantics = useMemo<PostSemanticsStructured | undefined>(() => {
    if (!props.parsed || !props.parsed.semantics) {
      return undefined;
    }

    return parseTriplets(props.parsed.semantics.triplets);
  }, [props.parsed]);

  const getRefTitle = useCallback(
    (ref: string) => {
      const title = props.parsed?.support.refs.metadata[ref].title;
      return title;
    },
    [props.parsed]
  );

  if (DEBUG) console.log({ parsed: props.parsed, semantics });

  if (props.isLoading || !props.parsed) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <Box style={{ width: '100%' }}>
      {semantics && semantics.keywords ? (
        <Box>
          <Box style={{ display: 'block' }}>
            {semantics.keywords.map((keyWord, ix) => {
              return (
                <Text
                  style={{ fontWeight: 'bold' }}
                  key={ix}>{`#${keyWord}`}</Text>
              );
            })}
          </Box>
        </Box>
      ) : (
        <></>
      )}
      {semantics && semantics.refs.size > 0 ? (
        <Box margin={{ top: 'small' }}>
          <Box style={{ display: 'block' }}>
            <Box>
              {Array.from(semantics.refs.entries()).map(([ref, semantics]) => {
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
      ) : (
        <></>
      )}
    </Box>
  );
};
