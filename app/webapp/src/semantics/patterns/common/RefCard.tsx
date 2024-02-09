import { Box, Image, Paragraph } from 'grommet';

import { AppCard, AppHeading, FixedHeightPar } from '../../../ui-components';

export const RefCard = (props: { reference: string; support: any }) => {
  const title = props.support.refs.metadata[props.reference].title;
  const description = props.support.refs.metadata[props.reference].description;
  const image = props.support.refs.metadata[props.reference].image;

  return (
    <AppCard
      direction="row"
      align="start"
      style={{ padding: '18px 12px' }}
      gap="medium">
      <Box width="30%" style={{ flexShrink: 0 }}>
        <Image src={image}></Image>
      </Box>
      <Box>
        <AppHeading level="4">{title}</AppHeading>
        <FixedHeightPar _content={description}></FixedHeightPar>
      </Box>
    </AppCard>
  );
};
