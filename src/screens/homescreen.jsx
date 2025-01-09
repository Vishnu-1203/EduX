import React, {useRef} from 'react';
import {
  Animated,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';

export default function HomeScreen({navigation}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Login');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../src/assets/dashboard/LogoEdu.png')}
          style={styles.image}
          resizeMode="contain"
          aspectratio={1}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}>
          <Image
            source={require('../../src/assets/dashboard/buttonstarted.png')}
            style={styles.buttonstarted}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0325',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 80,
    bottom: 60,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    letterSpacing: -5,
    fontSize: 70,
    fontWeight: 'bold',
    color: '#8031A7',
  },
  subtitle: {
    fontSize: 22,
    fontSize: 20,
    color: 'lightgrey',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 0,
  },
  customButton: {
    fontWeight: 'bold',
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#7979B2',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: 'lightgrey',
    shadowOffset: {width: 1, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    bottom: 55,
  },
  customButtonText: {
    color: '#0E0325',
    letterSpacing: 7,
    fontSize: 18,
    fontWeight: 'bold',
  },

  image: {
    width: 420,
    height: 420,
  },
  buttonstarted: {
    width: '85%',
    marginLeft: 25,
    marginTop: -160,
  },
});
