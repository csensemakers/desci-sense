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

  const removeLabel = (label: string) => {
    if (props.removeLabel) {
      props.removeLabel(label);
    }
  };

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
        backgroundColor: adding
          ? constants.colors.backgroundLight
          : 'transparent',
        position: 'relative',
      }}>
      <Box style={{ display: 'block' }}>
        {props.labels.map((keyWord, ix) => {
          return (
            <Box
              style={{ display: 'block', float: 'left', paddingTop: '5.5px' }}>
              <AppLabel
                showClose={adding}
                remove={() => removeLabel(keyWord)}
                key={ix}
                margin={{ right: 'small', bottom: 'xsmall' }}>
                {keyWord}
              </AppLabel>
            </Box>
          );
        })}
        <Box style={{ display: 'block', float: 'left', paddingTop: '5px' }}>
          {adding ? (
            <Box>
              <AppInput
                plain
                ref={keyInput}
                value={newLabel}
                onChange={(event) =>
                  setNewLabel(event.target.value)
                }></AppInput>
            </Box>
          ) : (
            <Box
              style={{
                width: '120px',
              }}
              onClick={() => setAdding(true)}>
              <AppButton
                plain
                color={constants.colors.backgroundLightDarker}
                style={{ height: '36px', textTransform: 'none' }}
                justify="center">
                <Text>{t('add/remove')}...</Text>
              </AppButton>
            </Box>
          )}
        </Box>
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
