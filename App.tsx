// App.tsx
import React from 'react';
import Navigation from './src/navigation/navigation';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const linking = {
  prefixes: ['eduX://'],
};

export default function App() {
  return (
    <WalletConnectProvider
      {...({
        bridge: "https://bridge.walletconnect.org", // Use the official bridge
        bridgeless: false,                           // Disable bridgeless mode
        redirectUrl: 'eduX://walletconnect',
        storageOptions: { asyncStorage: AsyncStorage },
        linking,
        clientMeta: {
          description: "EduX dApp",
          url: "https://yourdapp.com",
          icons: ["https://yourdapp.com/icon.png"],
          name: "EduX",
        },
        chainId: 11155111, // Explicitly set the chainId for Sepolia
        rpc: { 11155111: `https://sepolia.infura.io/v3/${Config.INFURA_PROJECT_ID}` } // Provide a valid RPC URL
      } as any)}
    >
      <Navigation />
    </WalletConnectProvider>
  );
}
