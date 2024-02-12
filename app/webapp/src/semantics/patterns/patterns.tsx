import { Box } from 'grommet';
import React from 'react';

import { AppPostSemantics, ParserResult } from '../../shared/parser.types';
import { KeywordsComponent } from './keywords/Keywords.component';
import { RefLabelsComponent } from './refs-labels/Reflabels.component';

export interface PatternProps {
  originalParsed?: ParserResult;
  semantics?: AppPostSemantics;
  semanticsUpdated?: (semantics: AppPostSemantics) => void;
}

export const patternsLib: React.ComponentType<PatternProps>[] = [
  KeywordsComponent,
  RefLabelsComponent,
];

export const Patterns = (props: PatternProps) => {
  return (
    <Box gap="large">
      {patternsLib.map((Pattern, ix) => {
        return (
          <Box>
            <Pattern key={ix} {...props}></Pattern>
          </Box>
        );
      })}
    </Box>
  );
};
