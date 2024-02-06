import { Box, BoxExtendedProps } from 'grommet';

import { useThemeContext } from './ThemedApp';

export const AppLabel = (props: BoxExtendedProps): JSX.Element => {
  const { constants } = useThemeContext();

  return (
    <Box
      style={{
        textTransform: 'uppercase',
        fontSize: '14px',
        color: constants.colors.text,
        fontWeight: '700',
        ...props.style,
      }}>
      {props.children}
    </Box>
  );
};
