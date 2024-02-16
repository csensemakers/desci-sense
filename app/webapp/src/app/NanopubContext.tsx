import init, { NpProfile } from '@nanopub/sign';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getRSAKeys } from '../utils/rsa.keys';
import { useAccountContext } from './AccountContext';
import { useAppSigner } from './signer/SignerContext';

const DEBUG = false;

export type TwitterContextType = {
  profile?: NpProfile;
  connect: () => void;
  isConnecting: boolean;
  needAuthorize?: boolean;
};

const NanopubContextValue = createContext<TwitterContextType | undefined>(
  undefined
);

const KEYS_KEY = 'NP_PEM_KEYS';

/** Manages the authentication process */
export const NanopubContext = (props: PropsWithChildren) => {
  const { connectedUser, refresh: refreshConnectedUser } = useAccountContext();
  const { signMessage, connect: connectWallet } = useAppSigner();

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectIntention, setConnectIntention] = useState<boolean>(false);
  const [signatureAsked, setSignatureAsked] = useState<boolean>(false);
  const [connectAsked, setConnectAsked] = useState<boolean>();
  const [profile, setProfile] = useState<NpProfile>();

  const checkProfile = useCallback(async () => {
    const keysStr = localStorage.getItem(KEYS_KEY);
    if (DEBUG) console.log('checkProfile', { keysStr });

    if (!connectedUser || !connectedUser.orcid) return;

    if (keysStr) {
      const keys = JSON.parse(keysStr);
      const keyBody = keys.privateKey
        .replace(/-----BEGIN PRIVATE KEY-----\n?/, '')
        .replace(/\n?-----END PRIVATE KEY-----/, '')
        .replace(/\r/g, '')
        .replace(/\n/g, '');

      if (DEBUG) console.log('checkProfile', { keyBody });
      await (init as any)();

      const profile = new NpProfile(
        keyBody,
        `https://orcid.org/${connectedUser.orcid.orcid}`,
        `${connectedUser.orcid.name}`,
        ''
      );

      if (DEBUG) console.log('profile', { profile });

      setProfile(profile);
      setIsConnecting(false);
    }
  }, [connectedUser]);

  /** check profile once */
  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  const deriveKeys = useCallback(
    async (sig: string) => {
      if (DEBUG) console.log('deriveKeys start', { sig });
      const keys = getRSAKeys(sig);
      if (DEBUG) console.log('deriveKeys done', { keys });
      localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
      checkProfile();
    },
    [checkProfile]
  );

  /** as long as connect intention is true, go through the connection steps */
  useEffect(() => {
    if (profile) {
      if (DEBUG) console.log('final setConnectionIntention false');
      setConnectIntention(false);
      return;
    }

    /** once there is a connected user who can sign, sign */
    if (connectIntention && connectedUser && signMessage && !signatureAsked) {
      if (DEBUG) console.log('getting signature');
      setIsConnecting(true);
      setSignatureAsked(true);
      signMessage('Prepare my Nanopub identity').then((sig) => {
        deriveKeys(sig);
      });
    } else {
      /** if there is not connected user, connect it (should enable the signMessage) */
      if (connectIntention && !connectAsked) {
        if (DEBUG) console.log('connecting wallet');
        setConnectAsked(true);
        setIsConnecting(true);
        connectWallet();
      }
    }
  }, [
    connectIntention,
    connectWallet,
    signMessage,
    connectedUser,
    profile,
    deriveKeys,
    signatureAsked,
    connectAsked,
  ]);

  const connect = () => {
    setConnectIntention(true);
  };

  return (
    <NanopubContextValue.Provider
      value={{
        connect,
        isConnecting,
        needAuthorize: profile === undefined,
      }}>
      {props.children}
    </NanopubContextValue.Provider>
  );
};

export const useNanopubContext = (): TwitterContextType => {
  const context = useContext(NanopubContextValue);
  if (!context) throw Error('context not found');
  return context;
};
