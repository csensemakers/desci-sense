import { Box, Text } from 'grommet';
import { Add } from 'grommet-icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton, AppInput } from '../../../ui-components';
import { useThemeContext } from '../../../ui-components/ThemedApp';
import useOutsideClick from '../../../ui-components/hooks/OutsideClickHook';
import { parseTriplet } from '../../utils';
import { PatternProps } from '../patterns';

export const KeywordsComponent = (props: PatternProps) => {
  const keyInput = useRef<HTMLInputElement>(null);
  const { constants } = useThemeContext();

  const { t } = useTranslation();

  const [keyword, setKeyword] = useState<string>('');
  const [addingKeyword, setAddingKeyword] = useState<boolean>(false);

  useOutsideClick(keyInput, () => {
    if (addingKeyword) {
      setAddingKeyword(false);
    }
  });

  const triplets = props.parsed.semantics.triplets.map((t) => parseTriplet(t));

  const addKeyword = () => {
    setAddingKeyword(true);
  };

  useEffect(() => {
    if (keyInput.current) {
      keyInput.current.focus();
    }
  }, [addingKeyword]);

  const keywords = triplets
    .filter((t) => t[1] === 'has-keyword')
    .map((t) => t[2]);

  return (
    <Box>
      <Box direction="row" align="center">
        {keywords.map((keyWord, ix) => {
          return (
            <Box>
              <Text
                style={{ fontWeight: 'bold' }}
                key={ix}>{`#${keyWord}`}</Text>
            </Box>
          );
        })}
        <Box margin={{ left: 'medium' }}>
          {addingKeyword ? (
            <Box direction="row" align="center">
              <AppInput
                ref={keyInput}
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                style={{ padding: '0px 18px' }}></AppInput>

              <AppButton
                onClick={() => addKeyword()}
                margin={{ left: 'small' }}
                pad="small"
                label={t('add')}></AppButton>
            </Box>
          ) : (
            <AppButton
              plain
              style={{ textTransform: 'none' }}
              onClick={() => addKeyword()}>
              <Box direction="row" align="center">
                <Text style={{ fontWeight: 'bold' }} margin={{ right: '4px' }}>
                  {t('addKeyword')}
                </Text>
                <Add color={constants.colors.primary}></Add>
              </Box>
            </AppButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};
