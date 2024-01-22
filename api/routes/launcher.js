import { historicScraper, nextMatchesScraper } from "./scrapers.js";
import launchPuppeteer from "./puppeteer.js";

async function historicOdds(leagueName, startYear, endYear) {
    const browser = await launchPuppeteer();
    try {
        const odds = await historicScraper(browser, leagueName, startYear, endYear);
        return odds;
    } catch (err) {
        console.log(`Failed scraping: ${err}`);
    } finally {
        console.log("Closing browser");
        browser.close();
    }
}

async function nextMatches(leagueName) {
    const browser = await launchPuppeteer();
    try {
        const odds = await nextMatchesScraper(browser, leagueName);
        return odds;
    } catch (err) {
        console.log(`Failed scraping: ${err}`);
    } finally {
        console.log("Closing browser");
        browser.close();
    }
}

export { historicOdds, nextMatches }