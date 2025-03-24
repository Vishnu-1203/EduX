// polyfills.js
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: require('react-native-get-random-values').getRandomValues,
  };
}

console.log("Polyfills loaded: global.Buffer =", global.Buffer);
console.log("Polyfills loaded: global.crypto =", global.crypto);
