var express = require('express');
var router = express.Router();
import { addPredictions } from '../match_functions';

router.post('/', function(req, res, next) {
    const {date, homeTeam, awayTeam, predHomeScore, predAwayScore} = req.query;
    addPredictions(date, homeTeam, awayTeam, predHomeScore, predAwayScore);

})