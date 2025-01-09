import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {handleLogin, googleLogin} from '../utils/loginfunctions';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '513657717163-p3tqd6cpreqmrcd19u6h13cfdma7n4dv.apps.googleusercontent.com',
});

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../src/assets/dashboard/backbutton.png')}
          style={styles.backButton}
          resizeMode="contain"
          aspectratio={1}
        />
      </TouchableOpacity>
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>L O G I N</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPass}
          value={pass}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLogin(username, pass, navigation, setError)}>
          <Text style={styles.loginButtonText}>L O G I N</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchsignup}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchgoogle}
          onPress={() => googleLogin(navigation, setError)}>
          <Image
            source={require('../../src/assets/dashboard/googleloginbutton.png')}
            style={styles.image}
            resizeMode="contain"
            aspectratio={1}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0325',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    width: '80%',
    backgroundColor: '#0E0325',
    borderRadius: 15,
    shadowColor: '#7979B2',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 20,
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'lightgrey',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#7979B2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButtonText: {
    letterSpacing: 4.5,
    color: 'lightgrey',
    marginTop: 10,
    fontSize: 16,
  },
  googleSignInText: {
    fontSize: 16,
    color: 'lightgrey',
    marginTop: 10,
  },
  touchsignup: {
    width: '100%',
    height: 45,
    backgroundColor: '#0E0325',
    borderWidth: 2,
    borderColor: '#7979B2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
  touchgoogle: {
    marginTop: '8.5%',
    width: '100%',
    height: 45,
    shadowColor: '#7979B2',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    borderColor: '#0E0325',
  },
  image: {
    width: '100%',
    height: 57.5,
    borderRadius: 20,
    borderWidth: 5,
  },
  backButton: {
    position: 'absolute',
    top: '3.5%',
    left: '5%',
    width: 40,
    height: 40,
  },
});

export default Login;
