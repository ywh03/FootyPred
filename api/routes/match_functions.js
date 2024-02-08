import express from 'express';
import mongoose from 'mongoose';
import { getMatchResults } from './oddsportal_scrapers.js';

const UPCOMINGOFFSETDAYS = 2;
const router = express.Router();

const matchSchema = new mongoose.Schema({
    _id: String,
    homeTeam: String,
    awayTeam: String,
    homeProb: Number,
    drawProb: Number,
    awayProb: Number,
    leagueName: String,
    date: String,
    scrapedAt: String,
    predHomeScore: Number,
    predAwayScore: Number,
    actlHomeScore: Number,
    actlAwayScore: Number,
    payout: Number,
    exactGuess: Boolean,
    fotmobUrl: String,
    oddsportalUrl: String,
    matchStatus: String,
    hidden: {
        type: Boolean, 
        //default: false,
    }
})

const Match = mongoose.model("Match", matchSchema);

//TODO: Implement a system where the user can input a oddsportal url (or even better just the details of the match) and the match is added

function getOffsetCurrentISODate(offsetDays) {
    const currentDate = new Date();
    const offsetDate = new Date(currentDate);
    offsetDate.setDate(currentDate.getDate() - offsetDays);
    return offsetDate.toISOString();
}

async function newMatch(scrapedAt, date, homeTeam, awayTeam, homeProb, drawProb, awayProb, leagueName, oddsportalUrl, hidden, actlHomeScore, actlAwayScore) {
    const customId = `${date}-${homeTeam}-${awayTeam}`;
    console.log("Attempting to add match " + customId);
    const match = new Match({
        _id: customId,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeProb: homeProb,
        drawProb: drawProb,
        awayProb: awayProb,
        leagueName: leagueName,
        date: date,
        scrapedAt: scrapedAt,
        oddsportalUrl: oddsportalUrl,
        matchStatus: "Uncommenced",
        hidden: hidden,
    })
    if (actlHomeScore !== undefined && actlAwayScore !== undefined) {
        match.actlHomeScore = actlHomeScore;
        match.actlAwayScore = actlAwayScore;
    }
    await match.save()
        .then(() => console.log(`Match ${customId} added successfully`))
        .catch((err) => {console.error("Error adding match:", err)})
    return;
}

async function queryMatch(date, homeTeam, awayTeam) {
    const matchId = `${date}-${homeTeam}-${awayTeam}`;
    const query = {
        _id: matchId,
    }
    const queriedMatch = await Match.findOne(query);
    if (queriedMatch) {
        return queriedMatch.toJSON();
    }
    return null;
}

async function addPredictions(matchId, predHomeScore, predAwayScore) {
    const query = {
        _id: matchId,
    }
    const updateOperation = {
        $set: {
            predHomeScore: predHomeScore,
            predAwayScore: predAwayScore,
        }
    }
    const updatedMatch = await Match.findOneAndUpdate(query, updateOperation);
    if (updatedMatch) {
        console.log("Predictions for match " + matchId + " successfully added");
    } else {
        console.log("No document found for the given query");
    }
}

async function addResults(matchId, actlHomeScore, actlAwayScore, matchStatus) {
    console.log("Request to add results received");
    const query = {
        _id: matchId,
    }
    const updateOperation = {
        $set: {
            actlHomeScore: actlHomeScore,
            actlAwayScore: actlAwayScore,
            matchStatus: matchStatus,
        }
    }
    const updatedMatch = await Match.findOneAndUpdate(query, updateOperation);
    if (!updatedMatch) {
        console.log("Match not found or updated.");
    } else {
        console.log("Match updated successfully.");
    }
}

async function getAllMatches() {
    const allMatches = await Match.find({}).sort({_id : 1});
    return allMatches;
}

async function getUpdatedMatchScore(matchId) {
    const query = {
        _id: matchId,
    }
    const match = await Match.findOne(query);
    const oddsportalUrl = match.oddsportalUrl;
    console.log("Url: " + oddsportalUrl);
    const matchResults = await getMatchResults(oddsportalUrl);
    if (matchResults === "Error in opening page") return matchResults;
    if (matchResults.matchStatus !== "Uncommenced") {
        addResults(matchId, matchResults.actlHomeTeamScore, matchResults.actlAwayTeamScore, matchResults.matchStatus);
    }
    return matchResults;
}

async function toggleMatch(matchId, updatedHidden) {
    const query = {
        _id: matchId,
    }
    const updateOperation = {
        $set: {
            hidden: updatedHidden,
        }
    }
    const updatedMatch = await Match.findOneAndUpdate(query, updateOperation);
    if (!updatedMatch) {
        console.log("Match not found or updated.");
    } else {
        console.log("Match status updated successfully.");
    }
}

//GET ALL MATCHES
router.get('/', async function(req, res, next) {
    const allMatches = await getAllMatches();
    return res.json(allMatches);
})

//UPDATE MATCH
router.post('/', async function(req, res, next) {
    const matchId = req.body.matchId;
    const matchResults = await getUpdatedMatchScore(matchId);
    return res.json(matchResults);
})

router.post('/updatepred', async function(req, res, next) {
    console.log("Request to update predictions received");
    const matchId = req.body.matchId;
    const predHomeScore = req.body.predHomeScore;
    const predAwayScore = req.body.predAwayScore;
    try {
        await addPredictions(matchId, predHomeScore, predAwayScore);
        res.json({statusCode: 200});
    } catch (err) {
        console.log("Error adding predictions: " + err);
        res.json({statusCode: 500});
    }
})

router.post('/checkMatchesAndAdd', async function(req, res, next) {
    //console.log("Headers: " + req.headers['content-type']);
    //console.log("Body: " + JSON.stringify(req.body, null, 2));
    try {
        for (const match of req.body.matches) { //req.body should be an array of matches
            const matchFromDB = await queryMatch(match.date, match.homeTeam, match.awayTeam);
            if (matchFromDB) continue;
            else if (!match.hasOwnProperty("homeProb")){
                console.log("Match missing probs: " + match.date + match.homeTeam + match.awayTeam);
                continue;
            }
            else await newMatch(match.scrapedAt, match.date, match.homeTeam, match.awayTeam, match.homeProb, match.drawProb, match.awayProb, match.leagueName, match.oddsportalUrl, match.hidden);
        }
        return res.send({"status": "Matches successfully added to database."});
    } catch (err) {
        return res.send({"status": "Failed to add matches to database; " + err});
    }
})

router.post('/toggleMatch', async function(req, res, next) {
    try {
        await toggleMatch(req.body.matchId, req.body.updatedHidden);
        console.log("Match hidden status successfully toggled");
        res.send({"status": "Match hidden status successfully toggled"});
    } catch (err) {
        res.send({"status": "Failed to toggle match status; " + err});
    }
})

router.get('/pastMatches', async function(req, res, next) {
    try {
        const currentDate = getOffsetCurrentISODate(0);
        const query = {
            _id: {$lt: currentDate},
            hidden: false,
        }
        const pastMatches = await Match.find(query);
        res.json(pastMatches);
    } catch (err) {
        console.log("Failed to get past matches: " + err);
    }
})

router.get('/upcomingMatches', async function(req, res, next) {
    console.log("Query for upcoming matches received");
    try {
        const offsetDate = getOffsetCurrentISODate(UPCOMINGOFFSETDAYS);
        const query = {
            _id: {$gt: offsetDate},
            hidden: false,
        }
        const upcomingMatches = await Match.find(query);
        res.json(upcomingMatches);
    } catch (err) {
        console.log("Failed to get upcoming matches: " + err);
    }
})

router.get('/deletedMatches', async function(req, res, next) {
    try {
        const query = {
            hidden: true,
        }
        const deletedMatches = await Match.find(query);
        res.json(deletedMatches);
    } catch (err) {
        console.log("Failed to get deleted matches: " + err);
    }
})

router.post('/addMatchViaUrl', async function(req, res, next) {
    console.log("Request to add match via url received");
    const match = await getMatchResults(req.body.url);
    console.log("Match details obtained, passing to add match");
    const matchFromDB = await queryMatch(match.date, match.homeTeam, match.awayTeam);
    console.log(matchFromDB);
    if (matchFromDB) res.send("Match already in database");
    else if (match.hasOwnProperty("actlHomeTeamScore")){
        await newMatch(match.scrapedAt, match.date, match.homeTeam, match.awayTeam, match.homeProb, match.drawProb, match.awayProb, match.leagueName, match.oddsportalUrl, match.actlHomeTeamScore, match.actlAwayTeamScore);
        res.send("Match with scores added to database");
    } else {
        await newMatch(match.scrapedAt, match.date, match.homeTeam, match.awayTeam, match.homeProb, match.drawProb, match.awayProb, match.leagueName, match.oddsportalUrl);
        res.send("Match added to database");
    }
})

export default router;
export {newMatch, addPredictions, addResults, queryMatch, getAllMatches, getUpdatedMatchScore};