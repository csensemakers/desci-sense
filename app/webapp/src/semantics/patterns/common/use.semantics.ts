import { Store } from 'n3';
import { useMemo } from 'react';

import { parseRDF } from '../../../shared/n3.utils';
import { PatternProps } from '../patterns';

export const useSemanticsStore = (props: PatternProps) => {
  return useMemo<Store | undefined>(() => {
    if (!props.originalParsed && !props.semantics) {
      return undefined;
    } else {
      if (!props.originalParsed) throw new Error();
      return parseRDF(
        props.semantics ? props.semantics : props.originalParsed.semantics
      );
    }
  }, [props.originalParsed, props.semantics]);
};
