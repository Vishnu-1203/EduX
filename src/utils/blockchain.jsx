// src/utils/blockchain.js

// Import polyfills for React Native
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import * as ethers from 'ethers';
import Config from 'react-native-config';

// Create a provider using your Infura project ID
export const createProvider = () => {
  if (!Config.INFURA_PROJECT_ID) {
    throw new Error("INFURA_PROJECT_ID not set in environment variables");
  }
  return new ethers.providers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${Config.INFURA_PROJECT_ID}`
  );
};

export const provider = createProvider();

// Get a test signer (for development/testing)
export const getTestSigner = () => {
  if (!Config.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set in environment variables");
  }
  return new ethers.Wallet(Config.PRIVATE_KEY, provider);
};

// Get a MetaMask signer (for when users connect their wallet)
// In React Native, window.ethereum is not available so we fall back to test signer.
export const getMetamaskSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    return web3Provider.getSigner();
  } else {
    console.warn("MetaMask not detected in React Native environment; using test signer instead.");
    return getTestSigner();
  }
};

// Get a contract instance with a signer
export const getContractWithSigner = async (contractAddress, contractABI, useMetaMask = false) => {
  let signer;
  if (useMetaMask) {
    signer = await getMetamaskSigner();
  } else {
    signer = getTestSigner();
  }
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Convert reward to a blockchain token
export const convertRewardToToken = async (contractAddress, contractABI, rewardAmount, useMetaMask = true) => {
  try {
    const contract = await getContractWithSigner(contractAddress, contractABI, useMetaMask);
    const tx = await contract.convertReward(rewardAmount);
    console.log("Conversion transaction sent:", tx.hash);
    await tx.wait();
    console.log("Reward conversion confirmed:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error converting reward to token:", error);
    throw error;
  }
};
