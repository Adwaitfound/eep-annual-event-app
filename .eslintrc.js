module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'off',
    'react/prop-types': 'off',
    'react-native/no-inline-styles': 'warn',
  },
};
