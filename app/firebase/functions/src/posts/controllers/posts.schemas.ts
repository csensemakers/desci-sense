import { array, object, string } from 'yup';

export const postsValidationScheme = object({
  content: string().required(),
  platforms: array().of(string()).required(),
  meta: object().optional(),
}).noUnknown(true);

export const getPostMetaValidationScheme = object({
  content: string().required(),
}).noUnknown(true);
