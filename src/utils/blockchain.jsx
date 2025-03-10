import { ethers } from 'ethers';
import Config from 'react-native-config';

// Function to create a provider using your Infura project ID
export const createProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${Config.INFURA_PROJECT_ID}`
  );
};

export const provider = createProvider();

// Function to get a test signer (for development/testing)
export const getTestSigner = () => {
  const privateKey = Config.PRIVATE_KEY; // Ensure this is stored securely in your .env file
  return new ethers.Wallet(privateKey, provider);
};

// Function to get a MetaMask signer (for when users connect their wallet)
export const getMetamaskSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    return web3Provider.getSigner();
  } else {
    throw new Error('MetaMask is not detected. Please install MetaMask.');
  }
};

// Function to get a contract instance with a signer
export const getContractWithSigner = async (contractAddress, contractABI, useMetaMask = false) => {
  let signer;
  if (useMetaMask) {
    signer = await getMetamaskSigner();
  } else {
    signer = getTestSigner();
  }
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
};

// Example function to convert reward to a blockchain token
// This function interacts with a smart contract that converts rewards into tokens.
// Adjust the function name ('convertReward') and parameters according to your smart contract.
export const convertRewardToToken = async (contractAddress, contractABI, rewardAmount, useMetaMask = true) => {
  try {
    const contract = await getContractWithSigner(contractAddress, contractABI, useMetaMask);
    // Call the contract function that handles the conversion. Make sure your contract has such a function.
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
