import { formatEther } from '@ethersproject/units';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useBalance, useContractReader, useGasPrice } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import React, { FC, Fragment, useContext, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { useAppContracts } from '~common/components/context';
import { getNetworkInfo } from '~common/functions';

// This is the context that Unity will use to communicate with the React app.

// This is the React component that will be rendering the Unity app.
export const UnityComponent: FC = () => {
  // The app's state.´
  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
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
  const yourContract = useAppContracts('YourContract', ethersContext.chainId);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progression, setProgression] = useState<number>(0);
  const [purpose] = useContractReader(yourContract, yourContract?.purpose, [], yourContract?.filters.SetPurpose());
  const [balance, _update, status] = useBalance(ethersContext.account);
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast', getNetworkInfo(ethersContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  // Built-in event invoked when the Unity canvas is ready to be interacted with.
  function handleOnUnityCanvas(canvas: HTMLCanvasElement): void {
    canvas.setAttribute('role', 'unityCanvas');
  }

  // Built-in event invoked when the Unity app's progress has changed.
  function handleOnUnityProgress(progression: number): void {
    setProgression(progression);
  }

  // Built-in event invoked when the Unity app is loaded.
  function handleOnUnityLoaded(): void {
    setIsLoaded(true);
  }

  // Custom event invoked when the Unity app sends a message including something
  // written in an input field.
  function handleSetPurpose(message: string): void {
    /* look how you call setPurpose on your contract: */
    void tx?.(yourContract?.setPurpose(message));
  }

  // When the component is mounted, we'll register some event listener.
  useEffect(() => {
    addEventListener('canvas', handleOnUnityCanvas);
    addEventListener('progress', handleOnUnityProgress);
    addEventListener('loaded', handleOnUnityLoaded);
    addEventListener('SetPurpose', handleSetPurpose);
    // When the component is unmounted, we'll unregister the event listener.
    return function () {
      removeEventListener('canvas', handleOnUnityCanvas);
      removeEventListener('progress', handleOnUnityProgress);
      removeEventListener('loaded', handleOnUnityLoaded);
      removeEventListener('SetPurpose', handleSetPurpose);
    };
  }, [tx, addEventListener, removeEventListener]);

  // When the balance is updated, it will be sent to Unity.
  useEffect(() => {
    sendMessage('ReactHooks', 'SetBalance', status === 'success' ? formatEther(balance) : 'loading');
  }, [balance, isLoaded, status]);

  // This is the React component that will be rendering the Unity app.
  return (
    <Fragment>
      <div className="wrapper">
        {/* Introduction text */}
        <h1>React Unity WebGL Tests</h1>
        <p>In scaffold-eth-unity we will explore the possibilities with the React Unity WebGL Module.</p>
        {/* Some buttons to interact */}
        <h1 style={{ fontSize: '24px' }}>purpose: {purpose}</h1>
        {/* The Unity container */}
        <Fragment>
          <div className="unity-container">
            {/* The loading screen will be displayed here. */}
            {isLoaded === false && (
              <div className="loading-overlay">
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: (progression * 100).toString() + '%' }} />
                </div>
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
