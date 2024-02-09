import React from 'react';

import { AppPostSemantics, ParserResult } from '../../shared/types';
import { KeywordsComponent } from './keywords/Keywords.component';
import { RefLabelsComponent } from './refs-labels/Reflabels.component';

export interface PatternProps {
  parsed: ParserResult;
  semanticsUpdated?: (semantics: AppPostSemantics) => void;
}

export const patternsLib: React.ComponentType<PatternProps>[] = [
  KeywordsComponent,
  RefLabelsComponent,
];

export const Patterns = (props: {
  parsed: ParserResult;
  semanticsUpdated?: PatternProps['semanticsUpdated'];
}) => {
  return (
    <>
      {patternsLib.map((Pattern, ix) => (
        <Pattern
          key={ix}
          parsed={props.parsed}
          semanticsUpdated={props.semanticsUpdated}></Pattern>
      ))}
    </>
  );
};
