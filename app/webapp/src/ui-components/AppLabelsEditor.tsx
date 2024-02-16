import { Box, Keyboard, Text } from 'grommet';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton } from './AppButton';
import { AppInput } from './AppInput';
import { AppLabel } from './AppLabel';
import { useThemeContext } from './ThemedApp';
import useOutsideClick from './hooks/OutsideClickHook';

const DEBUG = false;

export const AppLabelsEditor = (props: {
  labels: string[];
  options?: string[];
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

  const allOptions = props.options;

  const onlyOptions = props.options !== undefined;

  const addWidth = '120px';

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

  const addLabel = (_label?: string) => {
    if (props.addLabel) {
      if (DEBUG) console.log('addLabel', { _label });
      const label = _label || newLabel;

      props.addLabel(label);
      if (!onlyOptions) reset();
      else setNewLabel('');
    }
  };

  const inputChanged = (input: string) => {
    setNewLabel(input);
  };

  const showCreator = !onlyOptions && newLabel;
  const showOptions = onlyOptions && adding;

  const showSelector = showCreator || (onlyOptions && adding);
  const selector = (() => {
    if (showCreator) {
      return (
        <AppButton
          plain
          onClick={() => addLabel()}
          style={{ textTransform: 'none' }}>
          <Box direction="row" align="center">
            <AppLabel margin={{ right: 'small' }}>{newLabel}</AppLabel>
            <Text color={constants.colors.lightTextOnLight}>{t('create')}</Text>
          </Box>
        </AppButton>
      );
    }

    if (showOptions && allOptions) {
      return (
        <Box style={{ display: 'block' }}>
          {allOptions.map((option, ix) => {
            const optionElement = (() => {
              return (
                <Box
                  style={{ display: 'block', float: 'left' }}
                  margin={{ right: 'small', bottom: 'xsmall' }}>
                  <AppLabel>{option}</AppLabel>
                </Box>
              );
            })();

            return (
              <AppButton
                plain
                key={ix}
                style={{ textTransform: 'none' }}
                onClick={() => addLabel(option)}>
                {optionElement}
              </AppButton>
            );
          })}
        </Box>
      );
    }
  })();

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
        {props.labels.map((label, ix) => {
          const marginRight = ix < props.labels.length - 1 ? 'small' : '0';
          return (
            <Box
              key={ix}
              style={{ display: 'block', float: 'left', paddingTop: '5.5px' }}>
              <AppLabel
                showClose={adding}
                remove={() => removeLabel(label)}
                key={ix}
                margin={{ right: marginRight, bottom: 'xsmall' }}>
                {label}
              </AppLabel>
            </Box>
          );
        })}
        <Box style={{ display: 'block', float: 'left', paddingTop: '5px' }}>
          {adding ? (
            <Keyboard onEnter={() => addLabel()} onEsc={() => setAdding(false)}>
              <Box>
                <AppInput
                  style={{
                    width: addWidth,
                    padding: '0px 0px 0px 12px',
                    color: constants.colors.text,
                  }}
                  plain
                  ref={keyInput}
                  value={newLabel}
                  onChange={(event) =>
                    inputChanged(event.target.value)
                  }></AppInput>
              </Box>
            </Keyboard>
          ) : (
            <Box
              margin={{ left: 'small' }}
              style={{
                width: addWidth,
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

      {showSelector ? (
        <Box
          style={{
            position: 'absolute',
            backgroundColor: constants.colors.backgroundLightShade,
            width: '100%',
            padding: '12px 12px 12px 12px',
            top: `${height}px`,
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            zIndex: 1,
          }}
          direction="row"
          align="center"
          justify="center"
          gap="small">
          {selector}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
