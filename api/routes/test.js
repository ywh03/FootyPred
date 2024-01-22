import { nextMatches, getLeagueUrls, getPageUrlsFromPage, getMatchInfo, matchHandler} from "./fotmob_scrapers.js";
import { getAllMatches } from "./match_functions.js";
import launchPuppeteer from "./puppeteer.js";
import { connectToDatabase, terminateConnection } from './db_functions.js';

(async () => {
    await connectToDatabase();

    const pageUrl = "https://www.fotmob.com/leagues/47/matches/premier-league";
    await matchHandler("premier-league");
    
    terminateConnection();
})();


/*
const pageUrl = "https://www.fotmob.com/leagues/47/matches/premier-league";
const browser = await launchPuppeteer();
try {
    const info = await getLeagueUrls(browser, "premier-league");
    console.log(info)
} catch (err) {
    console.log(`Failed scraping: ${err}`);
} finally {
    console.log("Closing browser");
    browser.close();
}
*/

//console.log(nextMatches("bundesliga"));