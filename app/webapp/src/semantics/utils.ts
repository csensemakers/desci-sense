import { PostSemanticsStructured, RefsMap, Triplet } from '../shared/types';

export const sortTriplets = (triplets: Triplet[]): PostSemanticsStructured => {
  /** extract keywords */
  const keywords = triplets
    .filter((t) => t[1] === 'has-keyword')
    .map((t) => t[2]);

  /** extract refs labels */
  const refs: RefsMap = new Map();

  const labelTriplets = triplets.filter(
    (triplet) => triplet[1] !== 'has-keyword'
  );

  /** fill the refs map with all the labels of each ref */
  for (const triplet of labelTriplets) {
    const label = triplet[1];
    const ref = triplet[2];
    const current = refs.get(ref);
    refs.set(
      ref,
      current
        ? { ...current, labels: current.labels.concat(label) }
        : { labels: [label] }
    );
  }

  return {
    keywords,
    refs,
  };
};

export const parseTriplets = (triplets: string[]): PostSemanticsStructured => {
  return sortTriplets(triplets.map((t) => parseTriplet(t)));
};

export const parseTriplet = (triplet: string): Triplet => {
  const regex = /<([^>]+)>/g;

  const parts = triplet.match(regex);
  if (!parts) throw new Error(`Unexpected triplet ${triplet}`);
  if (parts.length !== 3)
    throw new Error(`Unexpected triplet length ${JSON.stringify(triplet)}`);

  return parts.map((part) => {
    return part.slice(1, -1);
  });
};
