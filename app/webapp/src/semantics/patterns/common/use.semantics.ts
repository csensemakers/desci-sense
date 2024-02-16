import { Store } from 'n3';
import { useEffect, useState } from 'react';

import { parseRDF } from '../../../shared/n3.utils';
import { PatternProps } from '../patterns';

export const useSemanticsStore = (props: PatternProps) => {
  const [store, setStore] = useState<Store>();

  useEffect(() => {
    if (!props.originalParsed && !props.semantics) {
      setStore(undefined);
    } else {
      if (!props.originalParsed) throw new Error();
      parseRDF(
        props.semantics ? props.semantics : props.originalParsed.semantics
      ).then((store) => setStore(store));
    }
  }, [props.originalParsed, props.semantics]);

  return store;
};
