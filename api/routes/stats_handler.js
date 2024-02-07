import express from 'express';
import { getAllMatches } from './match_functions.js';

const router = express.Router();

function winReturn (actlHomeScore, actlAwayScore, predHomeScore, predAwayScore, homeProb, drawProb, awayProb) {
    if (actlHomeScore > actlAwayScore && predHomeScore > predAwayScore) return homeProb;
    else if (actlHomeScore === actlAwayScore && predHomeScore === predAwayScore) return drawProb;
    else if (actlHomeScore < actlAwayScore && predHomeScore < predAwayScore) return awayProb;
    return 0;
}

function isScoreCorrect (actlHomeScore, actlAwayScore, predHomeScore, predAwayScore) {
    if (actlHomeScore === predHomeScore && actlAwayScore === predAwayScore) return 1;
    return 0;
}

//XXX: can i get a database to store stats and update after matches instead? do i need a function to search everything again
router.get('/', async function (req, res) {
    const allMatches = await getAllMatches();
    const overallStats = {
        correctWins: 0,
        wrongWins: 0,
        correctScores: 0,
        wrongScores: 0,
        totalGain: 0,
        netGain: 0,
    };
    const leagueStats = {};
    const teamStats = {};
    for (const match of allMatches) {
        if (match.actlHomeScore === undefined) continue;
        const matchReturn = winReturn(match.actlHomeScore, match.actlAwayScore, match.predHomeScore, match.predAwayScore, match.homeProb, match.drawProb, match.awayProb);
        const exactReturn = isScoreCorrect(match.actlHomeScore, match.actlAwayScore, match.predHomeScore, match.predAwayScore);
        const matchLeague = match.leagueName;
        const matchHomeTeam = match.homeTeam;
        const matchAwayTeam = match.awayTeam;
        if (!leagueStats[matchLeague]) {
            leagueStats[matchLeague] = {
                correctWins: 0,
                wrongWins: 0,
                correctScores: 0,
                wrongScores: 0,
                totalGain: 0,
                netGain: 0,
            };
        }
        if (!teamStats[matchHomeTeam]) {
            teamStats[matchHomeTeam] = {
                correctWins: 0,
                wrongWins: 0,
                correctScores: 0,
                wrongScores: 0,
                totalGain: 0,
                netGain: 0,
            };
        }
        if (!teamStats[matchAwayTeam]) {
            teamStats[matchAwayTeam] = {
                correctWins: 0,
                wrongWins: 0,
                correctScores: 0,
                wrongScores: 0,
                totalGain: 0,
                netGain: 0,
            };
        }
        if (matchReturn) {
            overallStats.correctWins += 1;
            overallStats.totalGain += matchReturn;
            overallStats.netGain += matchReturn;
            leagueStats[matchLeague].correctWins += 1;
            leagueStats[matchLeague].totalGain += matchReturn;
            leagueStats[matchLeague].netGain += matchReturn;
            teamStats[matchHomeTeam].correctWins += 1;
            teamStats[matchHomeTeam].totalGain += matchReturn;
            teamStats[matchHomeTeam].netGain += matchReturn;
            teamStats[matchAwayTeam].correctWins += 1;
            teamStats[matchAwayTeam].totalGain += matchReturn;
            teamStats[matchAwayTeam].netGain += matchReturn;
        } else {
            overallStats.wrongWins += 1;
            overallStats.netGain -= 1;
            leagueStats[matchLeague].wrongWins += 1;
            leagueStats[matchLeague].netGain -= 1;
            teamStats[matchHomeTeam].wrongWins += 1;
            teamStats[matchHomeTeam].netGain -= 1;
            teamStats[matchAwayTeam].wrongWins += 1;
            teamStats[matchAwayTeam].netGain -= 1;
        }
        if (exactReturn) {
            overallStats.correctScores += 1;
            leagueStats[matchLeague].correctScores += 1;
            teamStats[matchHomeTeam].correctScores += 1;
            teamStats[matchAwayTeam].correctScores += 1;
        } else {
            overallStats.wrongScores += 1;
            leagueStats[matchLeague].wrongScores += 1;
            teamStats[matchHomeTeam].wrongScores += 1;
            teamStats[matchAwayTeam].wrongScores += 1;
        }
    }
    res.json({
        "overallStats": overallStats,
        "leagueStats": leagueStats,
        "teamStats": teamStats,
    });
})

export default router;