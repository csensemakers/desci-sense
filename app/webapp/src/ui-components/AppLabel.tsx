import { Box, BoxExtendedProps, Text } from 'grommet';
import { Close } from 'grommet-icons';

import { useThemeContext } from './ThemedApp';

export const AppLabel = (
  props: BoxExtendedProps & { showClose?: boolean }
): JSX.Element => {
  const { constants } = useThemeContext();

  return (
    <Box
      pad={{ left: 'medium', right: props.showClose ? 'small' : 'medium' }}
      {...props}
      style={{
        width: 'fit-content',
        backgroundColor: constants.colors.tagsBackground,
        fontSize: '14px',
        color: constants.colors.tagsText,
        fontWeight: '700',
        borderRadius: '6px',
        height: '36px',
        ...props.style,
      }}
      justify="center">
      <Box direction="row" align="center">
        <Text size="small">{props.children}</Text>
        {props.showClose ? (
          <Box margin={{ left: 'xsmall' }}>
            <Close color={constants.colors.tagsText} size="small"></Close>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
