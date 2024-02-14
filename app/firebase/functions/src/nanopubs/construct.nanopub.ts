import { Nanopub } from '@nanopub/sign';
import { AppPostCreate } from '../@shared/types';

export const constructNanopub = (post: AppPostCreate): Promise<Nanopub> => {
  const nanopub = Nanopub(rdfStr);
}