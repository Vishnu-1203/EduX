/**
 * @format
 */

// Load crypto and text encoding polyfills at the very top
import 'react-native-get-random-values'; // This sets up getRandomValues
import 'react-native-url-polyfill/auto';

import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Polyfill global.crypto if it doesn't exist
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: require('react-native-get-random-values').getRandomValues
  };
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
