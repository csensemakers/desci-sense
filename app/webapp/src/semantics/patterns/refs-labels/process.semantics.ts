import { Store } from 'n3';

import { filterStore, forEachStore } from '../../../shared/n3.utils';
import { RefMeta, ReflabelsSupport } from '../../../shared/parser.types';

export interface RefData {
  labelsUris: string[];
  meta?: RefMeta;
}
export type RefsMap = Map<string, RefData>;

export const processSemantics = (
  originalStore: Store,
  store: Store,
  support: ReflabelsSupport
): RefsMap => {
  const possiblePredicates = support.labelsOntology.map((item) => item.URI);

  /** get refLabels triplets */
  const orgRefLabels = filterStore(originalStore, (quad) =>
    possiblePredicates.includes(quad.predicate.value)
  );
  const refLabels = filterStore(store, (quad) =>
    possiblePredicates.includes(quad.predicate.value)
  );

  const refs: RefsMap = new Map();

  /** get the refs from the original store (even if their value is undefined) */
  forEachStore(orgRefLabels, (quad) => {
    const ref = quad.object.value;
    refs.set(ref, { labelsUris: [] });
  });

  /** then get the labels from the actual semantics */
  forEachStore(refLabels, (quad) => {
    const label = quad.predicate.value;
    const ref = quad.object.value;
    const current = refs.get(ref);
    const newLabels = current ? current.labelsUris.concat(label) : [label];

    refs.set(ref, { labelsUris: newLabels });
  });

  /** then append the metadata for each ref */
  for (const [ref, value] of Array.from(refs.entries())) {
    const meta = support.refsMeta[ref];
    if (!meta) {
      throw new Error('Unsupported from now undefined meta for ref');
    }

    refs.set(ref, {
      labelsUris: value ? value.labelsUris : [],
      meta,
    });
  }

  return refs;
};
