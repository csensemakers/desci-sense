import { Box, Spinner } from 'grommet';

import './LoadingDiv.css';

export const LoadingDiv = (props: {
  height?: string;
  width?: string;
  style?: React.CSSProperties;
}) => {
  const height = props.height || '22px';
  const width = props.width || '120px';

  return (
    <Box style={{ height, width, ...props.style }}>
      <div className="loading-square"></div>
    </Box>
  );
};

export const Loading = () => {
  return <Spinner></Spinner>;
};
