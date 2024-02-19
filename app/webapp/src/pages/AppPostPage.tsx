import { Nanopub } from '@nanopub/sign';
import { Box, Text } from 'grommet';
import { Send } from 'grommet-icons';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { useAccountContext } from '../app/AccountContext';
import { useNanopubContext } from '../app/NanopubContext';
import { TweetAnchor } from '../app/TwitterAnchor';
import { ViewportPage } from '../app/Viewport';
import { NANOPUBS_SERVER } from '../app/config';
import { getPostSemantics, postMessage } from '../functionsCalls/post.requests';
import { constructNanopub } from '../nanopubs/construct.nanopub';
import { PostEditor } from '../post/PostEditor';
import { SemanticsEditor } from '../semantics/SemanticsEditor';
import { PatternProps } from '../semantics/patterns/patterns';
import { AppPostSemantics, ParserResult } from '../shared/parser.types';
import { AppPost, AppPostCreate, PLATFORM } from '../shared/types';
import { AppButton, AppCard, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { Loading } from '../ui-components/LoadingDiv';
import { useThemeContext } from '../ui-components/ThemedApp';

const DEBUG = true;

export const AppPostPage = (props: {}) => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();
  const { appAccessToken, isConnecting, isConnected, connectedUser } =
    useAccountContext();

  const { profile } = useNanopubContext();

  /** postText is the text and is in sync with the PostEditor content */
  const [postText, setPostText] = useState<string>();
  const [postTextDebounced] = useDebounce(postText, 2000);

  /** parsed is the parsed semantics as computed by the service */
  const [parsed, setParsed] = useState<ParserResult>();

  /** parsedModified is the semantics after the user edited them */
  const [semantics, setSemantics] = useState<AppPostSemantics>();

  const [isSending, setIsSending] = useState<boolean>();
  const [isGettingSemantics, setIsGettingSemantics] = useState<boolean>();

  const [postSentError, setPostSentError] = useState<boolean>();

  /** the published post */
  const [post, setPost] = useState<AppPost>();

  const reset = () => {
    setPost(undefined);
    setPostText(undefined);
    setParsed(undefined);
    setSemantics(undefined);
    setIsSending(false);
    setIsGettingSemantics(undefined);
  };

  const send = useCallback(async () => {
    if (postText && appAccessToken && parsed) {
      setIsSending(true);

      let nanopubPublished: Nanopub | undefined = undefined;
      if (profile) {
        const _semantis = semantics || parsed.semantics;

        if (!connectedUser) throw new Error('User not connected');
        const nanopub = await constructNanopub(
          postText,
          _semantis,
          connectedUser
        );
        if (DEBUG) console.log({ nanopub });

        nanopubPublished = await nanopub.publish(profile, NANOPUBS_SERVER);
        if (DEBUG) console.log({ nanopubPublished });
      }

      const postCreate: AppPostCreate = {
        content: postText,
        originalParsed: parsed,
        semantics: semantics,
        signedNanopub: nanopubPublished?.info(),
        platforms: [PLATFORM.X],
      };
      if (DEBUG) console.log('postMessage', { postCreate });
      postMessage(postCreate, appAccessToken).then((post) => {
        if (post) {
          setPost(post);
          setIsSending(false);
        } else {
          setPostSentError(true);
        }
      });
    }
  }, [
    appAccessToken,
    connectedUser?.orcid?.orcid,
    parsed,
    postText,
    profile,
    semantics,
  ]);

  const getSemantics = () => {
    if (postText && appAccessToken && !semantics) {
      if (DEBUG) console.log('getPostMeta', { postText });
      setIsGettingSemantics(true);
      getPostSemantics(postText, appAccessToken).then((result) => {
        if (DEBUG) console.log({ result });
        setParsed(result);
        setIsGettingSemantics(false);
      });
    }
  };

  const semanticsUpdated: PatternProps['semanticsUpdated'] = (newSemantics) => {
    if (parsed) {
      if (DEBUG) console.log('semanticsUpdated', { newSemantics });
      setSemantics(newSemantics);
    }
  };

  useEffect(() => {
    if (DEBUG) console.log({ postTextDebounced, postText });
    if (postTextDebounced) {
      getSemantics();
    }
  }, [postTextDebounced]);

  const newPost = () => {
    reset();
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
          {isGettingSemantics !== undefined ? (
            <SemanticsEditor
              isLoading={isGettingSemantics}
              semantics={semantics}
              originalParsed={parsed}
              semanticsUpdated={semanticsUpdated}></SemanticsEditor>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  })();

  return (
    <ViewportPage
      content={<BoxCentered>{content}</BoxCentered>}
      nav={
        <>
          <AppButton
            margin={{ vertical: 'small' }}
            reverse
            icon={<Send color={constants.colors.primary}></Send>}
            label={t('post')}
            onClick={() => send()}></AppButton>
        </>
      }></ViewportPage>
  );
};
