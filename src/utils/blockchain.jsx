// src/utils/blockchain.js

// Import polyfills for React Native
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
  const provider = new ethers.JsonRpcProvider(url, { chainId: 11155111, name: 'sepolia', ensAddress: null });
  // Override getEnsAddress to prevent ENS lookups on Sepolia
  provider.getEnsAddress = () => Promise.resolve(null);
  return provider;
};

export const provider = createProvider();

// Get a test signer (for development/testing) using the PRIVATE_KEY
export const getTestSigner = () => {
  if (!Config.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set in environment variables");
  }
  return new ethers.Wallet(Config.PRIVATE_KEY, provider);
};

// Get a contract instance with a signer, ensuring the address is valid
export const getContractWithSigner = async (contractAddress, contractABI, signer) => {
  if (!signer) {
    signer = getTestSigner();
  }
  // Validate the contract address using ethers.getAddress
  const formattedAddress = ethers.getAddress(contractAddress);
  return new ethers.Contract(formattedAddress, contractABI, signer);
};

// Convert reward to a blockchain token
export const convertRewardToToken = async (contractAddress, contractABI, rewardAmount, signer = null) => {
  try {
    const contract = await getContractWithSigner(contractAddress, contractABI, signer);
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

// Minimal ERC20 ABI to fetch token balance
const ERC20ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

// Fetch the token balance for a given wallet address
export const getTokenBalance = async (tokenAddress, walletAddress) => {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    // Convert balance to a human-readable format (assuming 18 decimals)
    const formattedBalance = ethers.formatUnits(balance, 18);
    return formattedBalance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
};
