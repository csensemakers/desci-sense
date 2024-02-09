import { Box, DropButton, Text } from 'grommet';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton } from './AppButton';
import { AppInput } from './AppInput';
import { AppLabel } from './AppLabel';
import { useThemeContext } from './ThemedApp';
import useOutsideClick from './hooks/OutsideClickHook';

const DEBUG = true;

export const AppLabelsEditor = (props: {
  labels: string[];
  addLabel?: (label: string) => void;
  removeLabel?: (label: string) => void;
}) => {
  const { constants } = useThemeContext();
  const { t } = useTranslation();

  const keyBox = useRef<HTMLInputElement>(null);
  const keyInput = useRef<HTMLInputElement>(null);

  const [height, setHeight] = useState<number>();

  const [newLabel, setNewLabel] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    if (DEBUG) console.log('autofocusing input', { adding });
    if (adding && keyInput.current) {
      keyInput.current.focus();
    }
  }, [adding, keyInput]);

  const refreshHeight = () => {
    if (keyBox.current) {
      setHeight(keyBox.current.offsetHeight);
    }
  };

  useEffect(() => {
    refreshHeight();
  }, [props.labels, adding]);

  const reset = () => {
    if (DEBUG) console.log('reset');
    setNewLabel('');
    setAdding(false);
  };

  if (DEBUG) console.log({ adding });

  useOutsideClick(keyBox, () => {
    if (DEBUG) console.log('useOutsideClick', { adding });
    if (adding) {
      reset();
    }
  });

  const addLabel = () => {
    if (props.addLabel) {
      props.addLabel(newLabel);
      reset();
    }
  };

  return (
    <Box
      ref={keyBox}
      width="100%"
      style={{
        paddingTop: '12px',
        backgroundColor: adding
          ? constants.colors.backgroundLight
          : 'transparent',
        position: 'relative',
      }}>
      <Box
        onClick={() => setAdding(true)}
        style={{ cursor: 'pointer', display: 'block' }}>
        {props.labels.map((keyWord, ix) => {
          return (
            <Box
              style={{ display: 'block', float: 'left', paddingTop: '5.5px' }}>
              <AppLabel
                showClose={adding}
                key={ix}
                margin={{ right: 'small', bottom: 'small' }}>
                {keyWord}
              </AppLabel>
            </Box>
          );
        })}
        {adding ? (
          <Box style={{ display: 'block', float: 'left' }}>
            <AppInput
              plain
              ref={keyInput}
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}></AppInput>
          </Box>
        ) : (
          <Box style={{ display: 'block', float: 'left' }}>
            <AppButton
              plain
              color={constants.colors.backgroundLightDarker}
              style={{ height: '36px', textTransform: 'none' }}
              justify="center">
              <Text>{t('add')}...</Text>
            </AppButton>
          </Box>
        )}
      </Box>

      {newLabel ? (
        <Box
          style={{
            position: 'absolute',
            backgroundColor: constants.colors.backgroundLightShade,
            width: '100%',
            padding: '12px 12px 12px 12px',
            top: `${height}px`,
          }}
          direction="row"
          align="center"
          justify="center"
          gap="small"
          onClick={() => addLabel()}>
          <Text color={'black'}>Create:</Text>
          <AppLabel>{newLabel}</AppLabel>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
