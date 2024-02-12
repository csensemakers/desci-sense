import { RefMeta, ReflabelsSupport } from '../../../shared/parser.types';
import { Triplet } from '../../../shared/types';

export type RefsMap = Map<string, { labelsUris: string[]; meta?: RefMeta }>;

export const processTriplets = (
  triplets: Triplet[],
  support: ReflabelsSupport
) => {
  const possibleUris = support.labelsOntology.map((item) => item.URI);

  /** get refLabels triplets */
  const refLabelsTriplets = triplets.filter((triplet) =>
    possibleUris.includes(triplet[1])
  );

  /** group refLabels by ref and include ref metadata from parser support */
  const refs: RefsMap = new Map();

  for (const triplet of refLabelsTriplets) {
    const labelUri = triplet[1];
    const ref = triplet[2];
    const current = refs.get(ref);
    const newLabels = current
      ? current.labelsUris.concat(labelUri)
      : [labelUri];

    refs.set(ref, { labelsUris: newLabels });
  }

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
