import { mapStoreElements, parseRDF } from '../@shared/n3.utils';
import { AppPostSemantics, ParserResult } from '../@shared/parser.types';
import { AppPostCreate } from '../@shared/types';

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

export const constructTweet = async (post: AppPostCreate) => {
  const tags = await getTwitterTags(post.originalParsed, post.semantics);

  const appendTags =
    tags !== undefined
      ? '\n\n' + tags.map((tag: string) => `#${tag}`).join(' ')
      : '';

  const appendNpUrl =
    post.signedNanopub !== undefined
      ? '\n\n' + `nanopub: ${post.signedNanopub.uri})`
      : '';

  return post.content + appendTags + appendNpUrl;
};

export const getTwitterTags = async (
  originalParsed: ParserResult,
  _semantics?: AppPostSemantics
): Promise<string[] | undefined> => {
  const semantics = _semantics || originalParsed.semantics;
  const keywordOntology = originalParsed.support.keywords.keyWordsOntology;
  const refLabelsOntology = originalParsed.support.refLabels.labelsOntology;

  const store = await parseRDF(semantics);

  const keywords = mapStoreElements(store, (quad) => {
    if (quad.predicate.value === keywordOntology.URI) {
      return quad.object.value;
    }

    const item = refLabelsOntology.find(
      (item) => item.URI === quad.predicate.value
    );
    if (item) {
      return item.display_name;
    }

    return undefined;
  }).filter((e) => e !== undefined) as string[];

  return keywords.map((k) => forceTag(k as string));
};
