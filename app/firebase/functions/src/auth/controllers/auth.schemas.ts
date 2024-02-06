import { object, string } from 'yup';

export const authCodeScheme = object({
  code: string().required(),
}).noUnknown(true);

export const verifierCodeScheme = object({
  oauth_token: string().required(),
  oauth_verifier: string().required(),
}).noUnknown(true);
