const sharedConfig = require('../../libs/tailwind-config/tailwind.config.js');
const path = require('path');

module.exports = {
  ...sharedConfig,
  content: [
    path.join(__dirname, 'src/**/*.{html,ts}'),
    path.join(__dirname, '../../libs/ui/src/**/*.{html,ts}'),
  ],
};
