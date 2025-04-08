const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('react-native-crypto'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
      util: require.resolve('util'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
