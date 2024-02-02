import express from "express";
import launchPuppeteer from "./puppeteer.js";

import { oddsportalLeaguesUrlsMap, remappedTeamNames } from "./constants.js";

const router = express.Router();
const leaguesToScrape = [
    "premier-league",
]

//TODO: catch invalid url and return error
async function getMatchResults(matchUrl) {
    const browser = await launchPuppeteer();
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    await page.goto(matchUrl, {waitUntil: 'load'}); //use load so that ongoing match red class can be loaded
    await page.waitForSelector('div.relative.px-\\[12px\\].flex.max-mm\\:flex-col.w-auto.min-sm\\:w-full.pb-5.pt-5.min-mm\\:items-center.font-semibold.text-\\[22px\\].text-black-main.gap-2.border-b.border-black-borders.font-secondary');

    page.on('console', (message) => {
        console.log("Console message: " + message.text());
    })

    const result = await page.evaluate((matchUrl) => {
        console.log("Starting to get match results.");
        try {
            const scoreField = document.querySelector('div.relative.px-\\[12px\\].flex.max-mm\\:flex-col.w-auto.min-sm\\:w-full.pb-5.pt-5.min-mm\\:items-center.font-semibold.text-\\[22px\\].text-black-main.gap-2.border-b.border-black-borders.font-secondary');
            const scores = scoreField.querySelectorAll('div.max-mm\\:gap-2>div.flex-wrap.gap-2');
            let matchStatus = "Completed";
            if (scores.length === 0 || scores[0].textContent === '') matchStatus = "Uncommenced";
            else if (scores[0].classList.contains("text-red-dark")) matchStatus = "Ongoing";
            const homeTeamScore = scores[0].textContent;
            const awayTeamScore = scores[1].textContent;
            const teams = document.querySelectorAll("span.truncate");
            const homeTeam = teams[0].textContent;
            const awayTeam = teams[1].textContent;
            const timeField = document.querySelector('div.flex.text-xs.font-normal.text-gray-dark.font-main.item-center.gap-1');
            const sepTimes = timeField.querySelectorAll('p+p');
            const dateString = sepTimes[0].textContent + " " + sepTimes[1].textContent;
            const dateObject = new Date(dateString);
            const dateISOString = dateObject.toISOString();
            //const matchId = dateISOString + "-" + homeTeam + "-" + awayTeam;
            const oddsField = document.querySelector('div.border-black-borders.bg-gray-light.flex.h-9.border-b.border-l.border-r.text-xs');
            const odds = oddsField.querySelectorAll('p.height-content');
            const homeProb = odds[1].textContent;
            const drawProb = odds[2].textContent;
            const awayProb = odds[3].textContent;
            const leagueField = document.querySelector('a[data-testid|="3"]');
            const leagueName = leagueField.textContent.toLowerCase().split(" ").join('-');
            const scrapedAt = new Date().toISOString();
            const data = {
                scrapedAt: scrapedAt,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                homeProb: homeProb,
                drawProb: drawProb,
                awayProb: awayProb,
                leagueName: leagueName,
                date: dateISOString,
                oddsportalUrl: matchUrl[0],
                matchStatus: matchStatus
            }
            if (matchStatus !== "Uncommenced") {
                data.actlHomeTeamScore = homeTeamScore;
                data.actlAwayTeamScore = awayTeamScore;
            }
            if (matchStatus === "Ongoing") {
                const matchTime = document.querySelector('.result-live+div');
                data.matchStatus = matchTime.textContent;
            }
            return data;
        } catch (err) {
            console.log("Error: " + err);
        }
    }, [matchUrl])
    await browser.close();
    return result;
}

//TODO: Implement getIndivMatch and getMatchInfo route

async function getMatches(league, type) {
    let leagueUrl;
    if (type === "nextMatches") leagueUrl = oddsportalLeaguesUrlsMap[league];
    else leagueUrl = oddsportalLeaguesUrlsMap[league] + "/results/";
    const browser = await launchPuppeteer();
    const page = await browser.newPage();
    await page.setViewport({width: 1800, height: 2500});
    await page.goto(leagueUrl, {waitUntil: 'load'});
    //await page.waitForSelector('div.eventRow.flex.w-full.flex-col.text-xs');
    console.log("League loaded " + leagueUrl);

    page.on('console', (message) => {
        console.log("Console message: " + message.text());
    });

    const data = await page.evaluate((league, remappedTeamNames) => {
        function dateToISOString(date, time) {
            console.log(date);
            console.log(time);
            let localDate;
            //BUG: generating time like this can cause issues since matches might not start on time - this causes duplicates of the same match to appear in the database with slightly different times (perhaps check link?)
            //Running the link will take additional time... and a lot more complexity
            if (time === "FIN") {
                console.log("Match just completed");
                const currentTime = new Date();
                const startingTime = new Date(currentTime.getTime() - 95*60*1000);
                startingTime.setSeconds(0);
                startingTime.setMilliseconds(0);
                localDate = startingTime;
            } else if (time[time.length-1] === "'") {
                console.log("Match ongoing");
                const currentTime = new Date();
                const startingTime = new Date(currentTime.getTime() - parseInt(time.slice(0, -1))*60*1000);
                startingTime.setSeconds(0);
                startingTime.setMilliseconds(0);
                localDate = startingTime;
            } else {
                const dateParts = date.split(" ");
                const monthAbbreviation = dateParts[1];
                const monthNo = new Date(Date.parse(monthAbbreviation + " 1, 2000")).getMonth() + 1;
                localDate = new Date(`${dateParts[2]}-${monthNo.toString().padStart(2, '0')}-${dateParts[0].padStart(2, '0')}T${time}:00`);
            }
            const isoDateString = localDate.toISOString();
            return isoDateString;
        }
        let dates = [];
        let matches = [];
        let currentDate = null;
        const matchBlocks = document.querySelectorAll('div.eventRow.flex.w-full.flex-col.text-xs');
        for (const matchBlock of matchBlocks) {
            const dateBlocks = matchBlock.querySelector('div.border-black-borders.bg-gray-light.flex.w-full.min-w-0.border-l.border-r');
            if (dateBlocks) {
                const dateField = dateBlocks.querySelector('div.text-black-main.font-main.w-full.truncate.text-xs.font-normal.leading-5');
                let date = dateField.textContent;
                const dayDict = {
                    "Yesterday": -1,
                    "Today": 0,
                    "Tomorrow": 1
                }
                if (/^[a-zA-Z]/.test(date)) {
                    const newDay = new Date();
                    newDay.setDate(newDay.getDate() + dayDict[date.split(' ')[0].slice(0, -1)]);
                    date = newDay.toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year:'numeric'
                    })
                }
                dates.push(date);
                currentDate = date;
            }
            //NOTE: realMatchBlock not found
            //const realMatchBlock = matchBlock.querySelector('a.border-black-borders.flex.flex-col.border-b');
            const realMatchBlock = matchBlock.querySelector('div[data-testid="game-row"]');
            //DONE: Sometimes the overarching a doesn't have href, need look deeper
            let oddsportalUrl = realMatchBlock.href;
            if (oddsportalUrl === '') {
                const hrefBlock = realMatchBlock.querySelector('a[href]');
                oddsportalUrl = hrefBlock.href;
            }
            const timeField = realMatchBlock.querySelector('div.next-m\\:flex-col.min-md\\:flex-row.min-md\\:gap-1.text-gray-dark.flex.flex-row.self-center.text-\\[12px\\].w-full');
            const time = timeField.textContent;
            //console.log("Current date is " + currentDate + " " + time);
            const isoDateTime = dateToISOString(currentDate, time);
            const teams = realMatchBlock.querySelectorAll('p.truncate.participant-name');
            let homeTeam = teams[0].textContent;
            if (remappedTeamNames.hasOwnProperty(homeTeam)) homeTeam = remappedTeamNames[homeTeam];
            let awayTeam = teams[1].textContent;
            if (remappedTeamNames.hasOwnProperty(awayTeam)) awayTeam = remappedTeamNames[awayTeam];
            const scoresField = realMatchBlock.querySelector('div.max-mt\\:pl-1.flex.w-full.flex-col.gap-1.pt-\\[2px\\].text-xs.leading-\\[16px\\].min-mt\\:\\!flex-row.min-mt\\:\\!gap-2.justify-center div.relative.flex.text-gray-dark');
            let actlHomeTeamScore, actlAwayTeamScore;
            if (scoresField.textContent !== "–") {
                const scores = scoresField.querySelectorAll('div.hidden');
                actlHomeTeamScore = scores[0].textContent;
                actlAwayTeamScore = scores[1].textContent;
            }
            const oddsFields = realMatchBlock.querySelectorAll('p.height-content');
            let oddsArray = [];
            for (const oddsField of oddsFields) {
                if (oddsField.textContent === "-") continue;
                oddsArray.push(oddsField.textContent);
            }
            const homeProb = oddsArray[0];
            const drawProb = oddsArray[1];
            const awayProb = oddsArray[2];
            const scrapedAt = new Date().toISOString();
            const match = {
                date: isoDateTime,
                leagueName: league,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                homeProb: homeProb,
                drawProb: drawProb,
                awayProb: awayProb,
                oddsportalUrl: oddsportalUrl,
                scrapedAt: scrapedAt,
            }
            if (scoresField.textContent !== "-") {
                match.actlHomeTeamScore = actlHomeTeamScore,
                match.actlAwayTeamScore = actlAwayTeamScore
            }
            matches.push(match);
        }
        return matches;
    }, league, remappedTeamNames);
    //console.log(data);
    console.log("Scraping of " + league + " complete");
    await browser.close();
    return data;
}

router.get('/nextMatches', async function(req, res, next) {
    const league = req.query.league;
    /*
    let matches = [];
    for (const league of leaguesToScrape) {
        const leagueArr = await getMatches(league, "nextMatches");
        matches.push(...leagueArr);
    }
    */
    const matches = await getMatches(league, "nextMatches");
    res.json(matches);
})

router.get('/results', async function(req, res, next) {
    let matches = [];
    for (const league of leaguesToScrape) {
        const leagueArr = await getMatches(league, "results");
        matches.push(leagueArr);
    }
    return matches;
})

router.get('/getMatchInfo', async function(req, res, next) {
    const oddsportalUrl = req.query.oddsportalUrl;   
})

export default router;
export { getMatchResults };

//getMatches("premier-league");
//getMatchResults("https://www.oddsportal.com/football/england/premier-league/arsenal-crystal-palace-Ao25gRme");