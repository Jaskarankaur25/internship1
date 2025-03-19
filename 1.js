const puppeteer = require('puppeteer');

(async () => {
  try {
    // Launch Puppeteer browser instance in non-headless mode (so we can see the browser)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the website
    console.log('Navigating to the website...');
    await page.goto('https://books.toscrape.com/', { waitUntil: 'domcontentloaded' });

    // Wait for the page to load and the first book to appear
    console.log('Waiting for books to load...');
    await page.waitForSelector('.product_pod'); // Wait for the first book container to be visible

    // Extract data from the page
    console.log('Extracting data...');
    const books = await page.evaluate(() => {
      const bookElements = document.querySelectorAll('.product_pod');  // Select each book container
      const bookData = [];

      // Loop through each book and extract details
      bookElements.forEach((book) => {
        const titleElement = book.querySelector('h3 a');
        const priceElement = book.querySelector('.price_color');
        const ratingElement = book.querySelector('p');
        const linkElement = book.querySelector('h3 a');

        // Extract data from each element, checking if they exist
        const title = titleElement ? titleElement.getAttribute('title') : 'No title';
        const price = priceElement ? priceElement.textContent : 'No price';
        const rating = ratingElement ? ratingElement.getAttribute('class').split(' ')[1] : 'No rating';
        const link = linkElement ? linkElement.getAttribute('href') : 'No link';

        // Log each book's data for debugging purposes
        console.log({ title, price, rating, link });

        bookData.push({ title, price, rating, link });
      });

      return bookData;
    });

    // Output the scraped data in the terminal (formatted for better readability)
    console.log('Scraped Books Data:', JSON.stringify(books, null, 2));

    // Close the browser instance
    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
