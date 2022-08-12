import axios from 'axios';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useContractReader, useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import React, { FC, Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { useAppContracts } from '~common/components/context';
import { getNetworkInfo } from '~common/functions';

type NFTData = {
  datas: NFTWithMetaData[];
};

type NFTWithMetaData = {
  id: string;
  uri: string;
  base64Data: string;
  owner: string;
  description: string;
  image: string;
  name: string;
  attributes: (
    | {
        trait_type: string;
        value: string;
      }
    | {
        trait_type: string;
        value: number;
      }
  )[];
};

type NFT = {
  description: string;
  image: string;
  name: string;
  attributes: (
    | {
        trait_type: string;
        value: string;
      }
    | {
        trait_type: string;
        value: number;
      }
  )[];
};

// This is the React component that will be rendering the Unity app.
export const UnityComponent: FC = () => {
  // The app's state.´
  const {
    loadingProgression,
    unityProvider,
    isLoaded,
    requestFullscreen,
    requestPointerLock,
    sendMessage,
    initialisationError,
    addEventListener,
    removeEventListener,
    takeScreenshot,
  } = useUnityContext({
    productName: 'scaffold-eth-unity-webgl',
    companyName: 'BuidlGuidl',
    // The url's of the Unity WebGL runtime, these paths are public and should be
    // accessible from the internet and relative to the index.html.
    loaderUrl: 'unitybuild/Build/unitybuild.loader.js',
    dataUrl: 'unitybuild/Build/unitybuild.data',
    frameworkUrl: 'unitybuild/Build/unitybuild.framework.js',
    codeUrl: 'unitybuild/Build/unitybuild.wasm',
    streamingAssetsUrl: 'unitybuild/Build/streamingassets',
    // Additional configuration options.
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const ethersContext = useEthersContext();
  const yourNFT = useAppContracts('YourNFT', ethersContext.chainId);
  const address = ethersContext.account ?? '';
  const [unityListenerState, setListenerState] = useState('Uninitialized');
  const [balance] = useContractReader(yourNFT, yourNFT?.balanceOf, [address]);
  const yourBalance = balance && balance.toNumber();
  const [yourCollectibles, setYourCollectibles] = useState<NFTData>();

  const toDataURL = (url: string): Promise<string> =>
    fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = (): void => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const handleListenerState = useCallback((state: string) => {
    console.log(`Listener is ${state}`);
    setListenerState(state);
  }, []);

  useEffect(() => {
    addEventListener('SetListenerState', handleListenerState);
    return () => {
      removeEventListener('SetListenerState', handleListenerState);
    };
  }, [addEventListener, removeEventListener, handleListenerState]);

  useEffect(() => {
    const updateYourCollectibles = async (): Promise<void> => {
      if (balance === undefined) return;
      if (yourNFT === undefined) return;
      const nftData: NFTData = {
        datas: [],
      };
      for (let tokenIndex = BigNumber.from(0); tokenIndex < balance; tokenIndex = tokenIndex.add(1)) {
        try {
          console.log('GEtting token index', tokenIndex);
          const tokenId = await yourNFT.tokenOfOwnerByIndex(address, tokenIndex);
          console.log('tokenId', tokenId);
          const tokenURI = await yourNFT.tokenURI(BigNumber.from(tokenId));
          console.log('tokenURI', tokenURI);

          const ipfsHash = tokenURI?.replace('https://ipfs.io/ipfs/', '');
          console.log('ipfsHash', ipfsHash);

          const { data } = await axios.get<NFT>(tokenURI);
          console.log(data);
          const base64Data = await toDataURL(data.image);
          nftData.datas.push({
            id: tokenId.toString(),
            uri: tokenURI,
            base64Data: base64Data,
            owner: address,
            ...data,
          });
        } catch (e) {
          console.log(e);
        }
      }
      console.log('setYourCollectibles');
      setYourCollectibles(nftData);
      const serialized = JSON.stringify(yourCollectibles);
      sendMessage('ReactHooks', 'SetCollectibles', serialized ?? '[]');
    };
    void updateYourCollectibles();
  }, [unityListenerState, address, yourBalance]);

  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  // This is the React component that will be rendering the Unity app.
  return (
    <Fragment>
      <div className="wrapper">
        {/* Introduction text */}
        <h1>React Unity WebGL Tests</h1>
        <p>In scaffold-eth-unity we will explore the possibilities with the React Unity WebGL Module.</p>
        {/* Some buttons to interact */}
        <h1 style={{ fontSize: '24px' }}>purpose: </h1>
        {/* The Unity container */}
        <Fragment>
          <div className="unity-container">
            {/* The loading screen will be displayed here. */}
            {isLoaded === false && (
              <div className="loading-overlay">
                <div className="progress-bar"></div>
              </div>
            )}
            {/* The Unity app will be rendered here. */}
            <Unity style={{ width: '100%', margin: 'auto' }} className={'unity-canvas'} unityProvider={unityProvider} />
          </div>
          {/* Displaying some output values */}
        </Fragment>
      </div>
    </Fragment>
  );
};
