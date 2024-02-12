import { AppPostSemantics, ParserResult } from '../@shared/parser.types';
import { AppPostCreate } from '../@shared/types';
import {parseTriplet} from '../@shared/utils';


export const constructTweet = (post: AppPostCreate) => {
  const tags = getTwitterTags(post.originalParsed, post.semantics);

  const append = tags !== undefined
    ? '\n\n' + tags.map((tag: string) => `#${tag}`).join(' ')
    : '';

    return post.content + append;
    
}

export const getTwitterTags = (originalParsed: ParserResult, _semantics?: AppPostSemantics): string[] | undefined => {
  const semantics = _semantics || originalParsed.semantics;
  const keywordOntoloty = originalParsed.support.keywords.keyWordsOntology;
  const refLabelsOntology = originalParsed.support.refLabels.labelsOntology;

  const triplets = semantics.triplets.map((t) => parseTriplet(t))  
  const keywordsTriplets = triplets.filter((t) => {
    if (t[1] === keywordOntoloty.URI) {
      return true;
    }

    if (refLabelsOntology.find(item => item.URI === t[1])) {
      return true;
    }

    return false;
  }).filter(k => k !== undefined)

  return keywordsTriplets.map(t => t[1]);
}