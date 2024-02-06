import { Box, Text } from 'grommet';
import { Send } from 'grommet-icons';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { useAccountContext } from '../app/AccountContext';
import { TweetAnchor } from '../app/TwitterAnchor';
import { ViewportPage } from '../app/Viewport';
import { PostEditor } from '../post/PostEditor';
import { getPostMeta, postMessage } from '../post/post.utils';
import { AppPost, AppPostCreate, AppPostMeta, PLATFORM } from '../shared/types';
import { AppButton, AppCard, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { Loading } from '../ui-components/LoadingDiv';
import { useThemeContext } from '../ui-components/ThemedApp';

const DEBUG = true;

export const AppPostPage = (props: {}) => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();
  const { appAccessToken, isConnecting, isConnected } = useAccountContext();

  /** postText is the text and is in sync with the PostEditor content */
  const [postText, setPostText] = useState<string>();
  const [postTextDebounced] = useDebounce(postText, 2500);

  /** meta is the metadata of the post */
  const [meta, setPostMeta] = useState<AppPostMeta>();

  const [isSending, setIsSending] = useState<boolean>();
  const [postSentError, setPostSentError] = useState<boolean>();

  /** the published post */
  const [post, setPost] = useState<AppPost>();

  const send = () => {
    if (postText && appAccessToken) {
      setIsSending(true);
      const postCreate: AppPostCreate = {
        content: postText,
        meta,
        platforms: [PLATFORM.X],
      };
      if (DEBUG) console.log('postMessage', { postCreate });
      postMessage(postCreate, appAccessToken).then((post) => {
        if (post) {
          setPostText(undefined);
          setPost(post);
          setIsSending(false);
        } else {
          setPostSentError(true);
        }
      });
    }
  };

  const getMeta = () => {
    if (postText && appAccessToken) {
      if (DEBUG) console.log('getPostMeta', { postText });
      getPostMeta(postText, appAccessToken).then((meta) => {
        if (DEBUG) console.log({ meta });
        setPostMeta(meta);
      });
    }
  };

  useEffect(() => {
    if (DEBUG) console.log({ postTextDebounced, postText });
    if (postTextDebounced) {
      getMeta();
    }
  }, [postTextDebounced]);

  const newPost = () => {
    setPost(undefined);
    setPostMeta(undefined);
  };

  const content = (() => {
    if (isSending || isConnecting) {
      return <Loading></Loading>;
    }

    if (!isConnected) {
      return (
        <AppCard>
          <Text>{t('userNotConnected')}</Text>
        </AppCard>
      );
    }

    if (post) {
      return (
        <Box gap="medium" align="center">
          <AppHeading level="3">{t('postSent')}</AppHeading>
          <TweetAnchor id={post.tweet?.id}></TweetAnchor>
          <AppButton label={t('postNew')} onClick={() => newPost()}></AppButton>
        </Box>
      );
    }

    return (
      <Box width="100%" pad="medium">
        <PostEditor
          editable
          placeholder={t('writeYourPost')}
          onChanged={(text) => {
            setPostText(text);
          }}></PostEditor>

        <Box direction="row" gap="medium" margin={{ bottom: 'medium' }}>
          {meta ? (
            meta.tags.map((tag, ix) => <Text key={ix}>{`#${tag}`}</Text>)
          ) : (
            <></>
          )}
        </Box>

        <AppButton
          margin={{ vertical: 'small' }}
          reverse
          icon={<Send color={constants.colors.primary}></Send>}
          label={t('post')}
          onClick={() => send()}></AppButton>
      </Box>
    );
  })();

  return (
    <ViewportPage
      content={<BoxCentered>{content}</BoxCentered>}
      nav={<></>}></ViewportPage>
  );
};
