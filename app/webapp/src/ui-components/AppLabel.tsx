import { Box, BoxExtendedProps, Text } from 'grommet';

import { useThemeContext } from './ThemedApp';

export const AppLabel = (props: BoxExtendedProps): JSX.Element => {
  const { constants } = useThemeContext();

  return (
    <Box
      pad={{ horizontal: 'medium' }}
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
      <Text size="small">{props.children}</Text>
    </Box>
  );
};
