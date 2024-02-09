import { Triplet } from '../shared/types';

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
