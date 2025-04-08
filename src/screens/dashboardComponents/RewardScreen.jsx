// src/screens/dashboardComponents/RewardScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import { convertRewardToToken, getTestSigner, getTokenBalance } from '../../utils/blockchain';
import MyContractABI from '../../contracts/MyContractABI.json';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

// Log WalletConnect package version
const walletConnectPkg = require('@walletconnect/react-native-dapp/package.json');
console.log("WalletConnect version:", walletConnectPkg.version);

export default function RewardScreen({ navigation }) {
  const [reward, setReward] = useState(0);
  const [tokens, setTokens] = useState(0); // Backend token balance
  const [walletTokenBalance, setWalletTokenBalance] = useState('0'); // Wallet token balance from blockchain
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get WalletConnect connector using the hook
  const connector = useWalletConnect();

  // Log environment variables and connector details on mount
  useEffect(() => {
    console.log("INFURA_PROJECT_ID:", Config.INFURA_PROJECT_ID);
    console.log("PRIVATE_KEY:", Config.PRIVATE_KEY ? "set" : "not set");
    console.log("CONTRACT_ADDRESS:", Config.CONTRACT_ADDRESS);
    console.log("WalletConnect connector object:", connector);
    console.log("WalletConnect connector keys:", Object.keys(connector));
  }, []);

  // Listen for reward and tokens updates from Firestore in real time
  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (userId) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            console.log("Firestore data:", data);
            setReward(data.reward || 0);
            setTokens(data.tokens || 0);
          }
        });
      return () => unsubscribe();
    }
  }, []);

  // Fetch the wallet's token balance when connected
  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchWalletTokenBalance();
    }
  }, [walletConnected, walletAddress]);

  const fetchWalletTokenBalance = async () => {
    try {
      const tokenContractAddress = Config.TOKEN_CONTRACT_ADDRESS || Config.CONTRACT_ADDRESS;
      const balance = await getTokenBalance(tokenContractAddress, walletAddress);
      setWalletTokenBalance(balance);
      console.log("Fetched wallet token balance:", balance);
    } catch (error) {
      console.error("Error fetching token balance", error);
    }
  };

  // Updated wallet connection handler with additional debug logging for key/seed issues
  const handleConnectWallet = async () => {
    if (!connector.connected) {
      try {
        setIsLoading(true);
        console.log("Before connect, _key:", connector._key);
        // Attempt to connect via standard method
        if (typeof connector.connect === 'function') {
          await connector.connect();
        } else if (typeof connector.createSession === 'function') {
          await connector.createSession();
        } else {
          throw new Error("WalletConnect connector does not support connect or createSession.");
        }
        console.log("After connect, _key:", connector._key);
        if (connector._key && connector._key.seed) {
          console.log("Connector key seed:", connector._key.seed);
        } else {
          console.warn("Connector _key is missing seed property:", connector._key);
        }
        if (!connector.accounts || connector.accounts.length === 0) {
          throw new Error("No accounts available after connection.");
        }
        const account = connector.accounts[0];
        setWalletAddress(account);
        setWalletConnected(true);
        console.log("Wallet connected with account:", account);
        Alert.alert("Wallet Connected", `Connected: ${account.substring(0, 6)}...${account.slice(-4)}`);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        Alert.alert("Connection Error", error.message || "Failed to connect wallet.");
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Wallet already connected", `Connected: ${connector.accounts[0]}`);
    }
    console.log("WalletConnect connector keys after connect attempt:", Object.keys(connector));
    console.log("Full connector object after connect attempt:", JSON.stringify(connector, null, 2));
  };

  const handleConvertReward = async () => {
    try {
      setIsLoading(true);
      const CONTRACT_ADDRESS = Config.CONTRACT_ADDRESS;
      if (!CONTRACT_ADDRESS) {
        Alert.alert("Configuration Error", "Contract address not set in environment variables.");
        setIsLoading(false);
        return;
      }

      let signer;
      if (walletConnected && connector.connected) {
        try {
          signer = connector.getEthersSigner ? connector.getEthersSigner() : getTestSigner();
        } catch (error) {
          console.error("Error getting WalletConnect signer:", error);
          signer = getTestSigner();
        }
      } else {
        signer = getTestSigner();
      }

      const tx = await convertRewardToToken(CONTRACT_ADDRESS, MyContractABI, reward, signer);

      const userId = auth().currentUser?.uid;
      if (userId) {
        const userDoc = await firestore().collection('users').doc(userId).get();
        const userData = userDoc.data() || {};
        const currentTokens = userData.tokens || 0;
        await firestore().collection('users').doc(userId).update({
          reward: 0,
          tokens: currentTokens + reward,
        });
      }

      Alert.alert("Conversion Successful", `Transaction hash: ${tx.hash}`);
      if (walletConnected && walletAddress) {
        fetchWalletTokenBalance();
      }
    } catch (error) {
      console.error("Error converting reward to token:", error);
      Alert.alert("Conversion Error", error.message || "Failed to convert reward to token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Rewards</Text>
      <Text style={styles.rewardText}>Current Reward: {reward}</Text>
      <Text style={styles.tokenText}>Total Tokens (Backend): {tokens}</Text>
      {walletConnected && (
        <Text style={styles.balanceText}>Wallet Token Balance: {walletTokenBalance}</Text>
      )}

      {isLoading ? (
        <Text style={styles.loadingText}>Processing...</Text>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConvertReward}
            disabled={reward <= 0}
          >
            <Text style={styles.buttonText}>Convert to Token</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, walletConnected && styles.connectedButton]}
            onPress={handleConnectWallet}
          >
            <Text style={styles.buttonText}>
              {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </Text>
          </TouchableOpacity>

          {walletConnected && (
            <Text style={styles.walletText}>
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </Text>
          )}
        </>
      )}

      <View style={styles.envContainer}>
        <Text style={styles.envText}>
          INFURA_PROJECT_ID: {Config.INFURA_PROJECT_ID || "undefined"}
        </Text>
        <Text style={styles.envText}>
          PRIVATE_KEY: {Config.PRIVATE_KEY ? "set" : "undefined"}
        </Text>
        <Text style={styles.envText}>
          CONTRACT_ADDRESS: {Config.CONTRACT_ADDRESS || "undefined"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0E0325",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 20,
    textAlign: 'center',
  },
  rewardText: {
    fontSize: 22,
    color: "white",
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 22,
    color: "lightgreen",
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 20,
    color: "cyan",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#7979B2",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#7979B2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  connectedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: 'bold',
  },
  walletText: {
    color: "#4CAF50",
    fontSize: 16,
    marginBottom: 15,
  },
  envContainer: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
  },
  envText: {
    color: "white",
    fontSize: 14,
    marginVertical: 2,
  },
});
