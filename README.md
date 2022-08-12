# 🏗 Scaffold-Eth Typescript Unity NFT

## Unity WebGL

This special version of scaffold-eth-typescript has a few things:

1. Hardhat deploy scripts for minting nfts and publishing data on IPFS
2. regular scaffold-eth react frontend to query the blockchain for your NFT data and also IPFS data.
3. An integration which sends that data to unity webgl
4. A Unity scene where you can see the NFTs you own

## Typescript

This is the typescript repo of scaffold-eth and it uses `hardhat` and `vite` to run scaffold-eth-typescript. There is also a nextjs version. The directories that you'll use are:

```bash
packages/vite-app-ts/
packages/hardhat-ts/
packages/next-app-ts/
```

## Quick Start

### Setup pre deploy and launch

1. Get an IPFS infura project from infura.io, copy your project id and api key secret
2. Create the file `packages/vite-app-ts/.env.local` and override your Infura project ID and api key. You can see the format in `packages/vite-app-ts/.env` (the file you override by creating `packages/vite-app-ts/.env.local`)
3. Go to `packages/hardhat-ts/deploy/01_deploy_your_NFT.ts` and find the line with the `toAddress` variable. Here you want to put in your wallet address that you have in your browser. If you don't know which wallet address you will get due to using burner wallets or similar. Make a note of launching the app (`yarn start` before `yarn deploy`) once before deploying your NFTs. so you can copy your address from the browser and add it here.

### Commands to run the app

Running the app

1. install your dependencies, `open a new command prompt`

   ```bash
   yarn install
   ```

2. start a hardhat node

   ```bash
   yarn chain
   ```

3. run the app, `open a new command prompt`

   ```bash
   # build hardhat & external contracts types
   yarn contracts:build
   # deploy your hardhat contracts
   yarn deploy
   # start the app (vite)
   yarn start
   ```

4. If you'd like to run the nextjs app, `open a new command prompt`

   ```bash
   # start nextjs app
   yarn start:next

   ```

5. other commands

   ```bash
   # rebuild all contracts, incase of inconsistent state
   yarn contracts:rebuild
   # run hardhat commands for the workspace, or see all tasks
   yarn hardhat 'xxx'
   # get eth for testing locally
   yarn hardhat faucet xxx
   # run any subgraph commands for the workspace
   yarn subgraph 'xxx'
   ```

   Other folders

   ```bash
   # for subgraph
   packages/advanced/subgraph/
   packages/advanced/services/
   ```

### Environment Variables

Vite and NextJs app folders have `.env` files. To create local variables that overrride these, create a file called `.env.local`, or `.env.development.local` or `.env.production.local` and put your overrides in there.

You can set your `TARGET_NETWORK` with them.

## Overview

Everything you need to build on Ethereum! 🚀 Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)

- 🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat-ts/contracts`
- 📝 Edit your frontend `MainPage.tsx` in `packages/vite-app-ts/src`
- 💼 Edit your deployment scripts in `packages/hardhat-ts/deploy`
- 📱 Open http://localhost:3000 to see the app
- 👷🏽‍♂️ run `yarn hardhat` to get a list of all the tasks. Run `yarn hardhat taskname` to run the task.

<br/><br/><br/>

---

# Guides

## Documentation

- Check out [eth-hooks docs](https://scaffold-eth.github.io/eth-hooks) for example of how to use hooks

## 🏃💨 Speedrun Ethereum

Register as a builder [here](https://speedrunethereum.com) and start on some of the challenges and build a portfolio.

> 🏁 Make sure to click on the typescript tab!

<br/><br/><br/>

---

# More Information!

## 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

Eth-hooks documentation is [here](https://scaffold-eth.github.io/eth-hooks/). Learn how to use the contexts here.

## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

## 🛠 Buidl

Check out

- [Typescript challenges](https://github.com/scaffold-eth/scaffold-eth-typescript-challenges)
- [Typescript examples](https://github.com/scaffold-eth/scaffold-eth-typescript-examples)
- [Vanilla JS active branches](https://github.com/scaffold-eth/scaffold-eth/branches/active)
- Join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!
- [Follow the full Ethereum Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c)

## 🔭 Learning Solidity

Read the docs: https://docs.soliditylang.org

Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

### 🙏🏽 Support us!

Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!

## 🔐 P.S.About keys

You need an RPC and API keys for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/vite-app-ts/.env` or `packages/next-app-ts/.env` with your new keys.
