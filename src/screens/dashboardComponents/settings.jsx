import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Settings({ navigation }) {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('Signing out');
      navigation.navigate('Home');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0325',
    width: Dimensions.get('window').width,
    margin: 0,
  },
  text: {
    fontSize: 30,
    color: '#7979B2',
    marginBottom: 40,
    fontWeight: 'bold',
  },
   button: {
    backgroundColor: '#7979B2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#7979B2',
    shadowOffset: { width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#0E0325',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
