const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */

module.exports = {
  launch: {
    headless: false,
    cacheDirectory: '/home/apimathec/.cache/puppeteer/',
    executablePath: '/home/apimathec/.cache/puppeteer/',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
