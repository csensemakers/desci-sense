import { AppPostSemantics, ParserResult } from '../@shared/parser.types';
import { AppPostCreate } from '../@shared/types';
import { parseTriplet } from '../@shared/utils';

const forceTag = (input: string) => {
  const emojiRegex =
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g;

  return input
    .replace(emojiRegex, '')
    .split(/[- ]/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
};

export const constructTweet = (
  post: AppPostCreate,
  nanopubInfo?: { uri: string }
) => {
  const tags = getTwitterTags(post.originalParsed, post.semantics);

  const appendTags =
    tags !== undefined
      ? '\n\n' + tags.map((tag: string) => `#${tag}`).join(' ')
      : '';

  const appendNpUrl =
    nanopubInfo !== undefined ? '\n\n' + `nanopub: ${nanopubInfo.uri})` : '';

  return post.content + appendTags + appendNpUrl;
};

export const getTwitterTags = (
  originalParsed: ParserResult,
  _semantics?: AppPostSemantics
): string[] | undefined => {
  const semantics = _semantics || originalParsed.semantics;
  const keywordOntology = originalParsed.support.keywords.keyWordsOntology;
  const refLabelsOntology = originalParsed.support.refLabels.labelsOntology;

  const triplets = semantics.triplets.map((t) => parseTriplet(t));
  const keywords = triplets
    .map((t) => {
      if (t[1] === keywordOntology.URI) {
        return t[2];
      }

      const item = refLabelsOntology.find((item) => item.URI === t[1]);
      if (item) {
        return item.display_name;
      }

      return undefined;
    })
    .filter((k) => k !== undefined);

  return keywords.map((k) => forceTag(k as string));
};
