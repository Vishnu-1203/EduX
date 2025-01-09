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
        <Text style={styles.backButtonText}>{'<'}</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => googleLogin(navigation, setError)}>
          <Text style={styles.googleSignInText}>Google Sign-In</Text>
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
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'lightgrey',
  },
  loginBox: {
    width: '80%',
    backgroundColor: '#0E0325',
    borderRadius: 15,
    shadowColor: '#1DFF80',
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
    backgroundColor: '#1DFF80',
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
    color: 'lightgrey',
    marginTop: 10,
    fontSize: 16,
  },
  googleSignInText: {
    fontSize: 16,
    color: 'lightgrey',
    marginTop: 10,
  },
});

export default Login;
