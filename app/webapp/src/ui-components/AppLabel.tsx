import { Box, BoxExtendedProps, Text } from 'grommet';

import { useThemeContext } from './ThemedApp';

export const AppLabel = (props: BoxExtendedProps): JSX.Element => {
  const { constants } = useThemeContext();

  return (
    <Box
      pad={{ horizontal: 'medium', vertical: 'small' }}
      {...props}
      style={{
        backgroundColor: constants.colors.tagsBackground,
        fontSize: '14px',
        color: constants.colors.tagsText,
        fontWeight: '700',
        borderRadius: '6px',
        ...props.style,
      }}>
      <Text size="small">{props.children}</Text>
    </Box>
  );
};
