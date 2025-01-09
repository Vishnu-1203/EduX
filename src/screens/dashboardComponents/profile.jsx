import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const {displayName, photoURL, email} = currentUser;
      setUser({name: displayName, image: photoURL, email});
    }
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.profileCard}>
          <Image source={{uri: user.image}} style={styles.image} />
          <Text style={styles.infoText}>Name: {user.name}</Text>
          <Text style={styles.infoText}>Email: {user.email}</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0325',
  },
  profileCard: {
    width: Dimensions.get('window').width,
    maxWidth: 600,
    backgroundColor: '#0E0325',
    borderRadius: 60,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#7979B2',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#7979B2',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#7979B2',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 22,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#0E0325',
  },
});
