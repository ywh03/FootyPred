import express from 'express';
import launchPuppeteer from './puppeteer.js';
import {fotmobLeaguesUrlsMap, followedTeams} from './constants.js';
import {newMatch, queryMatch} from './match_functions.js';

const router = express.Router();
const PAGES_SCRAPED = 2;

const leaguesToScrape = [
    "premier-league",
]

async function matchHandler(leagueName) {
    const matchData = await nextMatches(leagueName);
    await addMatches(matchData, leagueName);
    console.log(`${leagueName} handled successfully`);
    return "handled";
}

async function addMatches(data, leagueName) {
    for (const dataset of data) {
        const match = dataset.value;
        if (!followedTeams.includes(match.homeTeam) && !followedTeams.includes(match.awayTeam)) {
            continue;
        }
        console.log(match);
        try {
            const queryResult = await queryMatch(match.date, match.homeTeam, match.awayTeam);
            console.log(queryResult);
            if (queryResult) {
                console.log("Match already logged");
            } else {
                await newMatch(match.scrapedAt, match.date, match.homeTeam, match.awayTeam, match.homeProb, match.drawProb, match.awayProb, leagueName, match.fotmobUrl);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

async function nextMatches(leagueName) {
    const browser = await launchPuppeteer();
    try {
        const leagueUrls = await getLeagueUrls(browser, leagueName);
        const matchUrlPromises = [];
        for (const url of leagueUrls) {
            console.log(`Started scraping urls from ${url}`);
            matchUrlPromises.push(getPageUrlsFromPage(browser, url));
        }
        const rawMatchUrls = await Promise.allSettled(matchUrlPromises);
        console.log("rawMatchUrls: " + JSON.stringify(rawMatchUrls));
        const arrMatchUrls = [];
        for (const matchUrls of rawMatchUrls) {
            arrMatchUrls.push(matchUrls.value);
        }
        const flattenedMatchUrls = arrMatchUrls.flat();
        console.log(flattenedMatchUrls);
        const matchInfoPromises = [];
        
        for (const url of flattenedMatchUrls) {
            console.log(`Started scraping match data from ${url}`);
            matchInfoPromises.push(getMatchInfo(browser, url));
        }
        const matchData = await Promise.allSettled(matchInfoPromises);
        
       /*
        console.log(flattenedMatchUrls[0]);
        const matchData = await getMatchInfo(browser, flattenedMatchUrls[1]);
        */
        console.log(matchData);
        return matchData;
    } catch (err) {
        console.log(`Failed scraping: ${err}`);
    } finally {
        console.log("Closing browser");
        browser.close();
    }
}

//RESOLVED (but with button not working errors occasionally)
async function getLeagueUrls(browser, leagueName) {
    let leagueStartingUrl = fotmobLeaguesUrlsMap[leagueName];
    const leagueUrls = [leagueStartingUrl];
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    for (let i=0; i<PAGES_SCRAPED-1; i++) {
        await page.goto(leagueStartingUrl);
        const button = await page.$x('//*[@id="__next"]/main/section/div[3]/section/div[1]/button[2]');
        //console.log(button);
        await Promise.all([
            button[0].click(),
            page.waitForNavigation({waitUntil: 'domcontentloaded'}),
        ])
        leagueUrls.push(page.url());
        leagueStartingUrl = page.url();
    }
    return leagueUrls;
}

// RESOLVED
async function getPageUrlsFromPage(browser, pageUrl) {
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    await page.goto(pageUrl);
    //NOTE: CLASS CHANGED
    const rawHrefValues = await page.$$eval('.eenhk2w0 a', a => a.map(a => a.getAttribute('href')));
    const trueHrefValues = [];
    for (const value of rawHrefValues) {
        trueHrefValues.push(`https://www.fotmob.com${value}`);
    }
    return trueHrefValues;
}

// RESOLVED
async function getMatchInfo(browser, pageUrl) {
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    await page.goto(pageUrl, {timeout: 60000});
    //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.e1rexsj40');
    const teams = await page.$$eval('.e1rexsj40', e => e.map(e => e.textContent));
    const homeTeam = teams[0];
    const awayTeam = teams[1];
    // Odds load extremely slow
    //Consider the 0 variant
    await page.waitForSelector('.eqwiqgh0, .eqwiqgh1, .ea2xfsc8');
    let odds = [];
    if (await page.$('.eqwiqgh0')) {
        odds = await page.$$eval('.eqwiqgh0 span', e => e.map(e => e.textContent));
    } else if (await page.$('.eqwiqgh1')) {
        odds = await page.$$eval('.eqwiqgh1 span', e => e.map(e => e.textContent));
    } else {
        odds = await page.$$eval('.ea2xfsc8 span', e => e.map(e => e.textContent));
    }
    const homeProb = odds[1];
    const drawProb = odds[3];
    const awayProb = odds[5];
    //date is in ISO String format
    await page.waitForSelector('time');
    const date = await page.$$eval('time', e => e.map(e => e.getAttribute('datetime')));
    const scrapedAt = new Date().toISOString();
    return {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeProb: homeProb,
        drawProb: drawProb,
        awayProb: awayProb,
        date: date[0],
        scrapedAt: scrapedAt,
        fotmobUrl: pageUrl,
    }
}

async function getMatchResult(fotmobUrl) {
    const browser = await launchPuppeteer();
    console.log("Browser launched");
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    console.log("Now Scraping: " + fotmobUrl);
    await page.goto(fotmobUrl);
    await page.waitForSelector(".ed9bevl1, .ed9bevl0");
    if (await page.$('.ed9bevl0')) {
        return {
            matchStatus: "Not Started",
        }
    } else if (await page.$('.ed9bevl1')) {
        /*
        const matchStatus = await page.$$eval('.ed9bevl1', spans => {
            return spans.map(span => span.textContent);
        });
        */
        const matchStatuses = await page.$$eval('.ed9bevl1', spans => spans.map(span => span.textContent));
        const matchStatus = matchStatuses[0];
        if (matchStatus === "Full time") {
            await page.waitForSelector(".ed9bevl7");
            const rawResultStrings = await page.$$eval('.ed9bevl7', spans => spans.map(span => span.textContent));
            const rawResultString = rawResultStrings[0];
            const results = rawResultString.replace(/\s/g, '').split("-");
            const homeScore = results[0];
            const awayScore = results[1];
            return {
                matchStatus: matchStatus,
                homeScore: homeScore,
                awayScore: awayScore,
            }
        } else if (matchStatus === "Abandoned") {
            return {
                matchStatus: matchStatus,
            }
        } else {
            console.log("matchStatus: " + matchStatus + fotmobUrl);
        }
    }
    //Ongoing match
}

router.get('/', async function(req, res, next) {
    for (const league of leaguesToScrape) {
        await matchHandler(league);
    }
})

export default router;
export {nextMatches, getLeagueUrls, getPageUrlsFromPage, getMatchInfo, matchHandler, getMatchResult};