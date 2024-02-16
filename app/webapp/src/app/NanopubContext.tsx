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

const DEBUG = true;

export type TwitterContextType = {
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
  const [needAuthorize, setNeedAuthorize] = useState<boolean>(true);
  const [connectIntention, setConnectIntention] = useState<boolean>(false);
  const [profile, setProfile] = useState<NpProfile>();

  const checkProfile = useCallback(() => {
    const keysStr = localStorage.getItem(KEYS_KEY);
    if (DEBUG) console.log('checkProfile', { keysStr });

    if (!connectedUser || !connectedUser.orcid)
      throw new Error(`Unexpected not connected user`);

    if (keysStr) {
      const keys = JSON.parse(keysStr);
      const keyBody = keys.privateKey
        .replace(/-----BEGIN PRIVATE KEY-----\n?/, '')
        .replace(/\n?-----END PRIVATE KEY-----/, '')
        .replace(/\r/g, '')
        .replace(/\n/g, '');

      if (DEBUG) console.log('checkProfile', { keyBody });

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

  const deriveKeys = useCallback(
    async (sig: string) => {
      if (DEBUG) console.log('deriveKeys start', { sig });
      await (init as any)();
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
    if (connectIntention && connectedUser && signMessage) {
      if (DEBUG) console.log('getting signature');
      setIsConnecting(true);
      signMessage('Prepare my Nanopub identity').then((sig) => {
        deriveKeys(sig);
      });
    } else {
      /** if there is not connected user, connect it (should enable the signMessage) */
      if (connectIntention) {
        if (DEBUG) console.log('connecting wallet');
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
  ]);

  const connect = () => {
    setConnectIntention(true);
  };

  useEffect(() => {
    if (connectedUser && connectedUser.twitter === undefined) {
      setNeedAuthorize(true);
    }
  }, [connectedUser]);

  return (
    <NanopubContextValue.Provider
      value={{
        connect,
        isConnecting,
        needAuthorize,
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
