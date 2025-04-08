// src/providers/WalletConnectProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import SignClient from '@walletconnect/sign-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import Config from 'react-native-config';

export const WalletConnectContext = createContext(null);

export const WalletConnectProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const projectId = '755f2f9f52a14c9fe2a8f93b27571bcf'; // Your WalletConnect project ID
        const signClient = await SignClient.init({
          projectId,
          relayUrl: "wss://relay.walletconnect.com",
          metadata: {
            name: 'EduX',
            description: 'Educational quiz app with token rewards',
            url: 'https://github.com/Vishnu-1203/EduX',
            icons: ['https://via.placeholder.com/150']
          },
          storageOptions: {
            asyncStorage: AsyncStorage,
          },
        });
        setClient(signClient);
        console.log("WalletConnect initialized successfully");
      } catch (error) {
        console.error("Failed to initialize WalletConnect", error);
      }
    }
    init();
  }, []);

  // Function to initiate connection
  const connectWallet = async () => {
    if (!client) return;
    try {
      const { uri, approval } = await client.connect({
        requiredNamespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData'
            ],
            chains: ['eip155:11155111'], // Sepolia testnet
            events: ['chainChanged', 'accountsChanged']
          }
        },
      });
      
      if (uri) {
        // In production, display this URI as a QR code or use deep linking.
        // For example, automatically open the URI:
        // await Linking.openURL(uri);
        console.log('WalletConnect URI:', uri);
      }
      
      const session = await approval();
      setSession(session);
      console.log('Session established', session);
      return session;
    } catch (error) {
      console.error("Error connecting wallet via WalletConnect v2:", error);
      throw error;
    }
  };

  // New method to obtain an ethers signer from the WalletConnect session
  const getEthersSigner = () => {
    if (!session) {
      throw new Error('No active WalletConnect session');
    }
    const accounts = session.namespaces.eip155.accounts;
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts connected in session');
    }
    // The account is in the format "eip155:11155111:<address>"
    const account = accounts[0].split(':')[2];
    
    // Create a JsonRpcProvider for Sepolia using your Infura project ID
    const rpcUrl = `https://sepolia.infura.io/v3/${Config.INFURA_PROJECT_ID}`;
    const provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: 11155111,
      name: 'sepolia',
      ensAddress: null
    });
    
    // Create a VoidSigner as a base; we'll override its methods.
    const signer = new ethers.VoidSigner(account, provider);
    
    // Override sendTransaction to route through WalletConnect
    signer.sendTransaction = async (tx) => {
      const txParams = {
        from: account,
        to: tx.to,
        data: tx.data,
        value: tx.value ? ethers.toBeHex(tx.value) : '0x0',
        gasLimit: tx.gasLimit ? ethers.toBeHex(tx.gasLimit) : undefined,
        gasPrice: tx.gasPrice ? ethers.toBeHex(tx.gasPrice) : undefined
      };
      const hash = await client.request({
        topic: session.topic,
        chainId: 'eip155:11155111',
        request: {
          method: 'eth_sendTransaction',
          params: [txParams]
        }
      });
      return {
        hash,
        wait: async () => {
          let receipt = null;
          while (!receipt) {
            try {
              receipt = await provider.getTransactionReceipt(hash);
              if (receipt) break;
            } catch (e) {
              console.log('Waiting for transaction receipt...');
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          return receipt;
        }
      };
    };

    // Override signMessage to use WalletConnect for signing
    signer.signMessage = async (message) => {
      const result = await client.request({
        topic: session.topic,
        chainId: 'eip155:11155111',
        request: {
          method: 'personal_sign',
          params: [ethers.hexlify(ethers.toUtf8Bytes(message)), account]
        }
      });
      return result;
    };
    
    return signer;
  };

  const disconnectWallet = async () => {
    if (session) {
      try {
        await client.disconnect({
          topic: session.topic,
          reason: { code: 6000, message: 'User disconnected' }
        });
        setSession(null);
        console.log('Disconnected from wallet');
      } catch (error) {
        console.error('Error disconnecting wallet', error);
      }
    }
  };

  return (
    <WalletConnectContext.Provider value={{ client, session, connectWallet, disconnectWallet, getEthersSigner }}>
      {children}
    </WalletConnectContext.Provider>
  );
};
