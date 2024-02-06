import {
  APP_URL,
  ORCID_API_URL,
  ORCID_CLIENT_ID,
  ORCID_SECRET,
} from '../config/config';

export const getAuthenticatedOrcidId = async (code: string) => {
  const params = new URLSearchParams();

  params.append('client_id', ORCID_CLIENT_ID);
  params.append('client_secret', ORCID_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', APP_URL);

  const response = await fetch(`${ORCID_API_URL}/oauth/token`, {
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/x-www-form-urlencoded'],
    ],
    method: 'post',
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};
