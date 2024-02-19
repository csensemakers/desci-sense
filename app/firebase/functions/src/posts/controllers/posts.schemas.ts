import { array, object, string } from 'yup';

export const publishPostsValidationScheme = object({
  content: string().required(),
  platforms: array().of(string()).required(),
  originalParsed: object().required(),
  signedNanopub: object().required(),
  semantics: object().optional(),
}).noUnknown(true);

export const getPostSemanticsValidationScheme = object({
  content: string().required(),
}).noUnknown(true);

export const getUrlMetadataValidationScheme = object({
  url: string().required(),
}).noUnknown(true);
