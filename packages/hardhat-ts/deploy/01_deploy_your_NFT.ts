import * as fs from 'fs';
import * as path from 'path';

import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';
import { create } from 'ipfs-http-client';

const delayMS = 1000; // sometimes xDAI needs a 6000ms break lol 😅

const infuraIPFSProjectId = process.env.HARDHAT_INFURA_IPFS_PROJECT_ID ?? '';
const infuraIPFSAPIKeySecret = process.env.HARDHAT_INFURA_IPFS_API_KEY_SECRET ?? '';

const auth = 'Basic ' + Buffer.from(infuraIPFSProjectId + ':' + infuraIPFSAPIKeySecret).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('YourNFT', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: ["Hello"],
    log: true,
  });

  // ADDRESS TO MINT TO:
  const toAddress = '0xwriteyouradressyouhaveinyourbrowserhere';

  console.log('\n\n 🎫 Minting to ' + toAddress + '...\n');

  // upload image to ipfs
  const bufflaoImagePath = path.join(__dirname, '../files/buffalo.jpg');
  const buffaloBuffer = fs.readFileSync(bufflaoImagePath);
  const uploadedBuffaloImage = await ipfs.add(buffaloBuffer);
  console.log(`buffalo img with IPFS hash ${uploadedBuffaloImage.path}`);

  // Getting a previously deployed contract
  const yourNFT = await ethers.getContract('YourNFT', deployer);
  const buffalo = {
    description: "It's actually a bison?",
    image: `https://ipfs.io/ipfs/${uploadedBuffaloImage.path}`,
    name: 'Buffalo',
    attributes: [
      {
        trait_type: 'BackgroundColor',
        value: 'green',
      },
      {
        trait_type: 'Eyes',
        value: 'googly',
      },
      {
        trait_type: 'Stamina',
        value: 42,
      },
    ],
  };
  console.log('Uploading buffalo...');
  const uploaded = await ipfs.add(JSON.stringify(buffalo));

  console.log(`Minting buffalo with IPFS hash ${uploaded.path}`);
  await yourNFT.mintItem(toAddress, uploaded.path, { gasLimit: 400000 });

  await sleep(delayMS);

  // upload image to ipfs
  const zebraImagePath = path.join(__dirname, '../files/zebra.jpg');
  const zebraBuffer = fs.readFileSync(zebraImagePath);
  const uploadedZebraImage = await ipfs.add(zebraBuffer);
  console.log(`Zebra img with IPFS hash ${uploadedZebraImage.path}`);

  const zebra = {
    description: 'What is it so worried about?',
    image: `https://ipfs.io/ipfs/${uploadedZebraImage.path}`,
    name: 'Zebra',
    attributes: [
      {
        trait_type: 'BackgroundColor',
        value: 'blue',
      },
      {
        trait_type: 'Eyes',
        value: 'googly',
      },
      {
        trait_type: 'Stamina',
        value: 38,
      },
    ],
  };
  console.log('Uploading zebra...');
  const uploadedzebra = await ipfs.add(JSON.stringify(zebra));

  console.log('Minting zebra with IPFS hash (' + uploadedzebra.path + ')');
  await yourNFT.mintItem(toAddress, uploadedzebra.path, { gasLimit: 400000 });

  await sleep(delayMS);

  // upload image to ipfs
  const rhinoImagePath = path.join(__dirname, '../files/rhino.jpg');
  const rhinoBuffer = fs.readFileSync(rhinoImagePath);
  const uploadedRhinoImage = await ipfs.add(rhinoBuffer);
  console.log(`Rhino img with IPFS hash ${uploadedRhinoImage.path}`);

  const rhino = {
    description: 'What a horn!',
    image: `https://ipfs.io/ipfs/${uploadedRhinoImage.path}`,
    name: 'Rhino',
    attributes: [
      {
        trait_type: 'BackgroundColor',
        value: 'pink',
      },
      {
        trait_type: 'Eyes',
        value: 'googly',
      },
      {
        trait_type: 'Stamina',
        value: 22,
      },
    ],
  };
  console.log('Uploading rhino...');
  const uploadedrhino = await ipfs.add(JSON.stringify(rhino));

  console.log('Minting rhino with IPFS hash (' + uploadedrhino.path + ')');
  await yourNFT.mintItem(toAddress, uploadedrhino.path, { gasLimit: 400000 });

  await sleep(delayMS);

  console.log('Transferring Ownership of YourCollectible to ' + toAddress + '...');

  await yourNFT.transferOwnership(toAddress, { gasLimit: 400000 });

  await sleep(delayMS);
};

async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export default func;
func.tags = ['YourNFT'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
