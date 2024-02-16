import { Store } from 'n3';

import { filterStore, forEachStore } from '../../../shared/n3.utils';
import { RefMeta, ReflabelsSupport } from '../../../shared/parser.types';

export interface RefData {
  labelsUris: string[];
  meta?: RefMeta;
}
export type RefsMap = Map<string, RefData>;

export const processSemantics = (
  store: Store,
  support: ReflabelsSupport
): RefsMap => {
  const possiblePredicates = support.labelsOntology.map((item) => item.URI);

  /** get refLabels triplets */
  const refLabelsTriplets = filterStore(store, (quad) =>
    possiblePredicates.includes(quad.predicate.value)
  );

  /** group refLabels by ref and include ref metadata from parser support */
  const refs: RefsMap = new Map();

  forEachStore(refLabelsTriplets, (quad) => {
    const label = quad.predicate.value;
    const ref = quad.object.value;
    const current = refs.get(ref);
    const newLabels = current ? current.labelsUris.concat(label) : [label];

    refs.set(ref, { labelsUris: newLabels });
  });

  for (const [ref, value] of Array.from(refs.entries())) {
    const meta = support.refsMeta[ref];
    if (!meta) {
      throw new Error('Unsupported from now undefined meta for ref');
    }

    refs.set(ref, {
      ...value,
      meta,
    });
  }

  return refs;
};
