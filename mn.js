const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    // Launch the browser in non-headless mode for debugging
    const browser = await puppeteer.launch({ headless: false });
    console.log('Browser launched.');

    // Create a new page
    const page = await browser.newPage();

    // Go to the npm package page for Axios
    await page.goto('https://www.npmjs.com/package/axios', { waitUntil: 'load' });
    console.log('Page loaded.');

    // Wait for a reliable element, e.g., the h1 header
    await page.waitForSelector('h1', { timeout: 60000 });
    console.log('Found a header element.');

    // Extract the package name, description, and version
    const data = await page.evaluate(() => {
      // Find the package name and description
      const name = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : 'No name found';
      const description = document.querySelector('.PackageDescription__description') ? document.querySelector('.PackageDescription__description').textContent.trim() : 'No description found';
      const version = document.querySelector('p.PackageTitle__version') ? document.querySelector('p.PackageTitle__version').textContent.trim() : 'No version found';

      return { name, description, version };
    });

    // Output the scraped data to the console
    console.log('Scraped Data:', data);

    // Save the scraped data to a JSON file
    fs.writeFileSync('npm_axios_data.json', JSON.stringify(data, null, 2));

    // Introduce a small delay before closing the browser using setTimeout
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds timeout

    // Close the browser
    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();