const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://103.161.185.92:3000');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();

