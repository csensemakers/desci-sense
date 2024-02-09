import { TextInput, TextInputProps } from 'grommet';
import React from 'react';

import { useThemeContext } from './ThemedApp';

export const AppInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref): JSX.Element => {
    const { constants } = useThemeContext();

    return (
      <TextInput
        {...props}
        ref={ref}
        style={{
          border: '1px solid',
          borderRadius: '25px',
          height: '50px',
          borderColor: constants.colors.border,
          paddingLeft: '16px',
          fontWeight: 'normal',
          ...props.style,
        }}></TextInput>
    );
  }
);
