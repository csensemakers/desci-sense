import init, { NpProfile } from '@nanopub/sign';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { postUserEthDetails } from '../functionsCalls/auth.requests';
import { getEthToRSAMessage, getRsaToEthMessage } from '../shared/sig.utils';
import { EthAccountDetails, HexStr } from '../shared/types';
import {
  RSAKeys,
  getRSAKeys,
  signMessage as signMessageRSA,
} from '../utils/rsa.keys';
import { useAccountContext } from './AccountContext';
import { useAppSigner } from './signer/SignerContext';

const DEBUG = false;

export type NanopubContextType = {
  profile?: NpProfile;
  profileAddress?: HexStr;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  needAuthorize?: boolean;
};

const NanopubContextValue = createContext<NanopubContextType | undefined>(
  undefined
);

const KEYS_KEY = 'NP_PEM_KEYS';
const DETERMINISTIC_MESSAGE = 'Prepare my Nanopub identity';

/** Manages the authentication process */
export const NanopubContext = (props: PropsWithChildren) => {
  const {
    connectedUser,
    refresh: refreshConnectedUser,
    appAccessToken,
  } = useAccountContext();
  const { signMessage, connect: connectWallet, address } = useAppSigner();

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectIntention, setConnectIntention] = useState<boolean>(false);
  const [signatureAsked, setSignatureAsked] = useState<boolean>(false);
  const [connectAsked, setConnectAsked] = useState<boolean>();
  const [profile, setProfile] = useState<NpProfile>();
  const [profileAddress, setProfileAddress] = useState<HexStr>();
  const [rsaKeys, setRsaKeys] = useState<RSAKeys>();

  const [rsaToEthSignature, setRsaToEthSignature] = useState<string>();
  const [rootToRsaSignature, setRootToRsaSignature] = useState<HexStr>();

  /**
   * check for the rsa keys on localStorage, if they exist
   * prepares the Nanopub profile
   */
  const checkProfile = useCallback(async () => {
    const keysStr = localStorage.getItem(KEYS_KEY);
    if (DEBUG) console.log('checkProfile', { keysStr });

    if (!connectedUser || !connectedUser.orcid) return;

    if (keysStr) {
      const keys = JSON.parse(keysStr);
      setRsaKeys(keys);

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
      setProfileAddress(keys.address);
      setIsConnecting(false);
    } else {
      reset();
    }
  }, [connectedUser]);

  /** keep the rsaPublicKey up to date with the profile */
  const publicKey = useMemo(() => {
    if (!profile) return undefined;
    return profile.toJs().public_key;
  }, [profile]);

  /** keep user details aligned with profile and keep track of all the
   * eth<>rsa signatures (if not already done) */
  useEffect(() => {
    if (connectedUser && !connectedUser.eth) {
      if (
        rsaKeys &&
        address &&
        rsaToEthSignature &&
        rootToRsaSignature &&
        appAccessToken
      ) {
        const details: EthAccountDetails = {
          rsaPublickey: rsaKeys.publicKey,
          ethAddress: address,
          rsaToEthSignature,
          rootToRsaSignature,
        };
        if (DEBUG) console.log('posting user details', { details });
        postUserEthDetails(details, appAccessToken).then(() => {
          refreshConnectedUser();
        });
      } else if (!rsaToEthSignature && rsaKeys && address) {
        if (DEBUG)
          console.log('generating RSA signature of eth account', { rsaKeys });
        const rsaToEthSignature = signMessageRSA(
          getRsaToEthMessage(address),
          rsaKeys.privateKey
        );
        setRsaToEthSignature(rsaToEthSignature);
      } else if (!rootToRsaSignature && signMessage && rsaKeys) {
        if (DEBUG)
          console.log('generating ETH signature of RSA account', { address });
        signMessage(getEthToRSAMessage(rsaKeys.publicKey)).then((sig) => {
          setRootToRsaSignature(sig);
        });
      }
    }
  }, [
    publicKey,
    address,
    connectedUser,
    rsaKeys,
    rsaToEthSignature,
    rootToRsaSignature,
    appAccessToken,
    signMessage,
    refreshConnectedUser,
  ]);

  /** check profile once */
  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  /** create rsa keys from a secret (camed from a secret signature with the eth wallet) */
  const deriveKeys = useCallback(
    async (address: string, sig: string) => {
      if (DEBUG) console.log('deriveKeys start', { sig });
      const keys = getRSAKeys(sig);
      if (DEBUG) console.log('deriveKeys done', { keys });
      localStorage.setItem(KEYS_KEY, JSON.stringify({ ...keys, address }));

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
    if (
      connectIntention &&
      connectedUser &&
      signMessage &&
      !signatureAsked &&
      address
    ) {
      if (DEBUG) console.log('getting signature');
      setIsConnecting(true);
      setSignatureAsked(true);
      signMessage(DETERMINISTIC_MESSAGE).then((sig) => {
        deriveKeys(address, sig);
      });
    } else {
      /** if there is not connected user, connect it (this should end up enabling the signMessage) */
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
    address,
  ]);

  const connect = () => {
    setConnectIntention(true);
  };

  const reset = () => {
    setIsConnecting(false);
    setConnectIntention(false);
    setSignatureAsked(false);
    setConnectAsked(false);
    setProfile(undefined);
  };

  const disconnect = () => {
    localStorage.removeItem(KEYS_KEY);
    checkProfile();
  };

  return (
    <NanopubContextValue.Provider
      value={{
        connect,
        disconnect,
        profile,
        isConnecting,
        needAuthorize: profile === undefined,
        profileAddress,
      }}>
      {props.children}
    </NanopubContextValue.Provider>
  );
};

export const useNanopubContext = (): NanopubContextType => {
  const context = useContext(NanopubContextValue);
  if (!context) throw Error('context not found');
  return context;
};
