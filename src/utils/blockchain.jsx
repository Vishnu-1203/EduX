import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import * as ethers from 'ethers';
import Config from 'react-native-config';

// Create a provider using your Infura project ID with explicit network configuration for Sepolia
export const createProvider = () => {
  if (!Config.INFURA_PROJECT_ID) {
    throw new Error("INFURA_PROJECT_ID not set in environment variables");
  }
  const url = `https://sepolia.infura.io/v3/${Config.INFURA_PROJECT_ID}`;
  // Specify chainId 11155111 (Sepolia), network name, and disable ENS
  const provider = new ethers.JsonRpcProvider(url, { chainId: 11155111, name: 'sepolia', ensAddress: null });
  // Override getEnsAddress to prevent any ENS lookup
  provider.getEnsAddress = async (name) => null;
  return provider;
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
// In React Native, window.ethereum is typically unavailable so we fallback to test signer.
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

// Get a contract instance with a signer, ensuring the contract address is valid.
export const getContractWithSigner = async (contractAddress, contractABI, useMetaMask = false) => {
  let signer;
  if (useMetaMask) {
    signer = await getMetamaskSigner();
  } else {
    signer = getTestSigner();
  }
  // Resolve the address to a proper checksummed address.
  const resolvedAddress = ethers.getAddress(contractAddress);
  return new ethers.Contract(resolvedAddress, contractABI, signer);
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
