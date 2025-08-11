module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'expo-router/babel',
      // NOTE: Reanimated plugin must be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
