import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import { DateTime } from 'luxon';
import { getMatchResults } from './oddsportal_scrapers.js';

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
    isPredicting: Boolean,
})

const Match = mongoose.model("Match", matchSchema);

//TODO: Implement a system where the user can input a oddsportal url (or even better just the details of the match) and the match is added

async function newMatch(scrapedAt, date, homeTeam, awayTeam, homeProb, drawProb, awayProb, leagueName, oddsportalUrl) {
    const customId = `${date}-${homeTeam}-${awayTeam}`;
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
        oddsportalUrl: oddsportalUrl
    })
    await match.save()
        .then(() => console.log(`Match ${customId} added successfully`))
        .catch((err) => {console.error("Error adding match:", err)})
}

async function queryMatch(date, homeTeam, awayTeam) {
    const matchId = `${date}-${homeTeam}-${awayTeam}`;
    const query = {
        _id: matchId,
    }
    const queriedMatch = await Match.findOne(query);
    console.log(queriedMatch);
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

async function addResults(matchId, actlHomeScore, actlAwayScore) {
    console.log("Request to add results received");
    const query = {
        _id: matchId,
    }
    const updateOperation = {
        $set: {
            actlHomeScore: actlHomeScore,
            actlAwayScore: actlAwayScore,
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
    console.log(match);
    const oddsportalUrl = match.oddsportalUrl;
    const matchResults = await getMatchResults(oddsportalUrl);
    if (matchResults.matchStatus === "Completed") {
        addResults(matchId, matchResults.homeScore, matchResults.awayScore);
    }
    return matchResults;
}

//GET ALL MATCHES
router.get('/', async function(req, res, next) {
    const allMatches = await getAllMatches();
    return res.json(allMatches);
})

//UPDATE MATCH
router.post('/', async function(req, res, next) {
    const matchId = req.body.matchId;
    console.log(matchId);
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
    } catch (err) {
        console.log("Error adding predictions: " + err);
    }
})

router.post('/checkMatchesAndAdd', async function(req, res, next) {
    console.log("Headers: " + req.headers['content-type']);
    console.log("Body: " + JSON.stringify(req.body, null, 2));
    for (const match of req.body.matches) { //req.body should be an array of matches
        console.log(match);
        const matchFromDB = await queryMatch(match.date, match.homeTeam, match.awayTeam);
        console.log(matchFromDB);
        if (matchFromDB) continue;
        else newMatch(match.scrapedAt, match.date, match.homeTeam, match.awayTeam, match.homeProb, match.drawProb, match.awayProb, match.leagueName, match.oddsportalUrl);
    }
})


export default router;
export {newMatch, addPredictions, addResults, queryMatch, getAllMatches, getUpdatedMatchScore};