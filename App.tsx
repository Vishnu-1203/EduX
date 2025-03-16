// App.js
import React from 'react';
import Navigation from './src/navigation/navigation'; // Adjust path as needed
import { WalletConnectProvider } from './src/providers/WalletConnectProvider';

export default function App() {
  return (
    <WalletConnectProvider>
      <Navigation />
    </WalletConnectProvider>
  );
}
