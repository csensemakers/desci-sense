import React from 'react';

import { ParserResult } from '../../shared/types';
import { KeywordsComponent } from './keywords/Keywords.component';
import { RefLabelsComponent } from './refs-labels/Reflabels.component';

export interface PatternProps {
  parsed: ParserResult;
}

export const patternsLib: React.ComponentType<PatternProps>[] = [
  KeywordsComponent,
  RefLabelsComponent,
];

export const Patterns = (props: { parsed: ParserResult }) => {
  return (
    <>
      {patternsLib.map((Pattern, ix) => (
        <Pattern key={ix} parsed={props.parsed}></Pattern>
      ))}
    </>
  );
};
