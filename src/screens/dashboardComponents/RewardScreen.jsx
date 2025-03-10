import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import { convertRewardToToken, getMetamaskSigner } from '../../utils/blockchain';
import MyContractABI from '../../contracts/MyContractABI.json'; // Ensure this file exists

export default function RewardScreen({ navigation }) {
  const [reward, setReward] = useState(0);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (userId) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            setReward(data.reward || 0);
          }
        });
      return () => unsubscribe();
    }
  }, []);

  const handleConvertReward = async () => {
    try {
      // Get the contract address from environment variables
      const CONTRACT_ADDRESS = Config.CONTRACT_ADDRESS;
      if (!CONTRACT_ADDRESS) {
        Alert.alert("Configuration Error", "Contract address not set in environment variables.");
        return;
      }
      
      // Call the convertRewardToToken function from blockchain utilities.
      // 'true' means using MetaMask signer (for production use).
      const tx = await convertRewardToToken(CONTRACT_ADDRESS, MyContractABI, reward, true);
      Alert.alert("Conversion Successful", `Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error converting reward to token:", error);
      Alert.alert("Conversion Error", "Failed to convert reward to token.");
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      // Simply try to get a MetaMask signer; if it succeeds, notify the user.
      await getMetamaskSigner();
      Alert.alert("MetaMask Connected", "MetaMask wallet connected successfully.");
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
      Alert.alert("Connection Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Rewards</Text>
      <Text style={styles.rewardText}>Current Reward: {reward}</Text>
      <TouchableOpacity style={styles.button} onPress={handleConvertReward}>
        <Text style={styles.buttonText}>Convert to Token</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleConnectMetaMask}>
        <Text style={styles.buttonText}>Connect MetaMask</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0325",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 22,
    color: "white",
    marginBottom: 30,
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
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: 'bold',
  },
});
