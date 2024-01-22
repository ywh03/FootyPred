var express = require('express')
var router = express.Router();
import {queryMatch} from '../match_functions.js';

router.get("/", function(req, res, next){
    const {date, homeTeam, awayTeam} = req.query;
    const match = queryMatch(date, homeTeam, awayTeam);
    return res.json(match);
})

module.exports = router;