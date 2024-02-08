import { Box, Text } from 'grommet';
import { Send } from 'grommet-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { useAccountContext } from '../app/AccountContext';
import { TweetAnchor } from '../app/TwitterAnchor';
import { ViewportPage } from '../app/Viewport';
import { PostEditor } from '../post/PostEditor';
import { getPostSemantics, postMessage } from '../post/post.utils';
import {
  AppPost,
  AppPostCreate,
  AppPostSemantics,
  PLATFORM,
} from '../shared/types';
import { AppButton, AppCard, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { Loading, LoadingDiv } from '../ui-components/LoadingDiv';
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
  const [semantics, setPostSemantics] = useState<AppPostSemantics>();

  const [isSending, setIsSending] = useState<boolean>();
  const [isGettingSemantics, setIsGettingSemantics] = useState<boolean>();

  const [postSentError, setPostSentError] = useState<boolean>();

  /** the published post */
  const [post, setPost] = useState<AppPost>();

  const send = () => {
    if (postText && appAccessToken) {
      setIsSending(true);
      const postCreate: AppPostCreate = {
        content: postText,
        semantics: semantics,
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

  const getSemantics = () => {
    if (postText && appAccessToken) {
      if (DEBUG) console.log('getPostMeta', { postText });
      setIsGettingSemantics(true);
      getPostSemantics(postText, appAccessToken).then((semantics) => {
        if (DEBUG) console.log({ semantics });
        setPostSemantics(semantics);
        setIsGettingSemantics(false);
      });
    }
  };

  useEffect(() => {
    if (DEBUG) console.log({ postTextDebounced, postText });
    if (postTextDebounced) {
      getSemantics();
    }
  }, [postTextDebounced]);

  const newPost = () => {
    setPost(undefined);
    setPostSemantics(undefined);
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
          {isGettingSemantics ? (
            <LoadingDiv></LoadingDiv>
          ) : semantics ? (
            semantics.triplets.map((tag, ix) => <Text key={ix}>{`#${tag}`}</Text>)
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
