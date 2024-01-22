import { leaguesUrlsMap } from './constants.js';
import { DateTime } from 'luxon';

function getCurrentDateTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateTimeString;
}

function getYearsInRange(startYear, endYear) {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
}

function getUrlFrom(leagueName) {
    const url = leaguesUrlsMap[leagueName];
    if (!url) {
        console.log("League not found.");
    }
    return url;
}

async function extractOddsData(page, leagueName) {
    await page.waitForSelector('div.eventRow');
    const links = await page.$$eval('div.eventRow a[title]', els => els.map(el => el.getAttribute("href")));
    const uniqueLinks = Array.from(new Set(links));

    for (const link of uniqueLinks) {
        try {
            await page.goto(`https://www.oddsportal.com${link}`);
            const [day, date, time] = await page.$$eval('div.bg-event-start-time ~ p', els => els.map(el => el.innerText));
            const [homeTeam, awayTeam] = await page.$$eval('span.truncate', els => els.map(el => el.textContent));
            const [homeProb, drawProb, awayProb] = await page.$$eval('div[handicap-type-id] div:not(.bg-gray-med_light) div:not(.justify-start) p', els => els.map(el => el.innerText));
            const scrapedAt = getCurrentDateTimeString();
            const formattedDate = DateTime.fromFormat(`${date} ${time}`, 'dd LLLL yyyy HH:mm');
            const data = {scrapedAt, formattedDate, homeTeam, awayTeam, homeProb, drawProb, awayProb, leagueName};
            const fileName = `${date}-${homeTeam}-${awayTeam}.json`;
            console.log(fileName);
            console.log(JSON.stringify(data));
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function scrapeOddsHistoric(page, leagueName) {
    await page.waitForSelector("a.pagination-link");
    let pages = await page.$$eval("a.pagination-link", (els) => els.map(el => el.textContent));
    const currentUrl = await page.url();
    for (const pag of pages) {
        if (pag != 'Next') {
            let pageUrl = `${currentUrl}#/page/${pag}`;
            console.log(pageUrl);
            try {
                await page.goto(pageUrl);
                await extractOddsData(page, leagueName);
            } catch (err) {
                console.log(err);
            }
        }
    }
    await page.close();
}

async function historicScraper(browser, leagueName, startYear, endYear) {
    console.log(leagueName);
    const years = getYearsInRange(parseInt(startYear), parseInt(endYear));
    const baseUrl = getUrlFrom(leagueName);
    const historicUrls = [];
    for (const year of years) {
        historicUrls.push(`${baseUrl}-${year}-${year + 1}/results/`);
    }
    try {
        const promises = [];
        for (const url of historicUrls) {
            console.log(`Start scraping: ${url}`);
            const page = await browser.newPage();
            await page.setViewport({width: 1800, height: 2500});
            await page.goto(url);
            promises.push(scrapeOddsHistoric(page, leagueName));
        }
        const results = await Promise.allSettled(promises);
        const errors = results.filter(result => result.status === 'rejected');
        if (errors.length > 0) console.log(JSON.stringify(errors));
    } catch (err) {
        console.log(`Error scraping historical odds: ${err}`);
    }
}

async function nextMatchesScraper(browser, leagueName) {
    const baseUrl = getUrlFrom (leagueName);
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    await page.goto(baseUrl);
    await extractOddsData(page, leagueName);
}

export {historicScraper, nextMatchesScraper};