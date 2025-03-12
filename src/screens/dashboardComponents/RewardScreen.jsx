import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import { convertRewardToToken, getMetamaskSigner } from '../../utils/blockchain';
import MyContractABI from '../../contracts/MyContractABI.json'; // Ensure this file is populated with your ABI

export default function RewardScreen({ navigation }) {
  const [reward, setReward] = useState(0);

  // Log env variables on mount
  useEffect(() => {
    console.log("INFURA_PROJECT_ID:", Config.INFURA_PROJECT_ID);
    console.log("PRIVATE_KEY:", Config.PRIVATE_KEY);
    console.log("CONTRACT_ADDRESS:", Config.CONTRACT_ADDRESS);
  }, []);

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
      const CONTRACT_ADDRESS = Config.CONTRACT_ADDRESS;
      if (!CONTRACT_ADDRESS) {
        Alert.alert("Configuration Error", "Contract address not set in environment variables.");
        return;
      }
      
      // Ensure MetaMask is connected (or fallback to test signer)
      await getMetamaskSigner();
      
      const tx = await convertRewardToToken(CONTRACT_ADDRESS, MyContractABI, reward, true);
      Alert.alert("Conversion Successful", `Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error converting reward to token:", error);
      Alert.alert("Conversion Error", "Failed to convert reward to token.");
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      const signer = await getMetamaskSigner();
      if (signer) {
        Alert.alert("MetaMask Connected", "MetaMask wallet connected successfully.");
      }
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
      Alert.alert("Connection Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Your Rewards</Text>
      <Text style={styles.rewardText}>Current Reward: {reward}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleConvertReward}>
        <Text style={styles.buttonText}>Convert to Token</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleConnectMetaMask}>
        <Text style={styles.buttonText}>Connect MetaMask</Text>
      </TouchableOpacity>
      
      {/* Display env variables for debugging */}
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
