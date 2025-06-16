const cssInterop = require("react-native-css-interop/babel");

module.exports = {
  presets: [
    ...cssInterop.presets,
  ],
  plugins: [
    ...cssInterop.plugins,
    'tailwindcss/babel',
    'react-native-reanimated/plugin',
  ],
};