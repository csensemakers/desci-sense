import { AppPost } from '../../@shared/types';
import { HttpConnector } from '../http.connector';

export const getSemantics = async (
  content: Partial<string>,
  http: HttpConnector
): Promise<AppPost> => {
  return http.post('/posts/getSemantics', { content });
};
