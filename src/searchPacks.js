const puppeteer = require('puppeteer-extra')

// Hides puppeteer usage
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const searchPacks = async (q) => {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    // blocks image and CSS loading
    page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
        request.abort();
        else
        request.continue();
    });
    await page.goto(`https://nibl.co.uk/search?query=${q}`);
    
    const results = await page.$$eval('table > tbody > tr', rows => {
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.textContent);
        });
    });
    // creating JSON from parsed HTML
    let data = [];
    results.forEach(result => {
        const bot = result[0].trim()
        const pack = result[1].trim()
        const size = result[2].trim()
        const name = result[3].trim()
        data.push({bot, pack, size, name});
    },
    );
    await browser.close();
    return data;
}

module.exports = searchPacks;