import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const leagueSchema = new mongoose.Schema ({
    _id: String, //leagueName hyphenated e.g. premier-league
    alias: String, // Premier League, La Liga etc.
    followStatus: {
        type: String, //default-in, default-out, no-scrape
        default: "no-scrape",
    },
    oddsportalUrl: String
})

const League = mongoose.model("League", leagueSchema)

async function newLeague(leagueDetails) {
    const league = new League({
        _id: leagueDetails._id,
        alias: leagueDetails.alias,
        followStatus: leagueDetails.followStatus,
        oddsportalUrl: leagueDetails.oddsportalUrl
    })
    await league.save()
        .then(() => console.log(`League ${leagueDetails._id} added successfully`))
        .catch((err) => {console.error("Error adding league:", err)})
    return;
}

async function getAllLeagues() {
    const allLeagues = await League.find({});
    return allLeagues;
}

async function getLeagueAlias(leagueId) {
    const league = await League.findOne({_id: leagueId});
    return league.alias;
}

async function getLeagueFollowStatus(leagueId) {
    const league = await League.findOne({_id: leagueId});
    return league.followStatus;
}

async function changeLeagueFollowStatus(leagueId, newStatus) {
    const query = {_id: leagueId};
    const updateOperation = {
        $set: {
            followStatus: newStatus
        }
    }
    try {
        const updatedLeague = await League.findOneAndUpdate(query, updateOperation);
        return "Success";
    } catch (err) {
        console.log("Error updating league follow status: " + err);
        return "Failure";
    }
}

//TODO: Add response codes to everything
router.get('/', async function (req, res, next) {
    try {
        const allLeagues = await getAllLeagues();
        res.send(allLeagues);
    } catch (err) {
        console.log("Error getting all leagues: " + err);
        res.send("Error getting all leagues");
    }
})

router.post('/updateStatus', async function (req, res, next) {
    const leagueId = req.body.leagueId;
    const newStatus = req.body.newStatus;
    const updateSuccess = await changeLeagueFollowStatus(leagueId, newStatus);
    if (updateSuccess === "Success") {
        res.json({responseCode: 201});
    } else {
        res.json({responseCode: 500});
    }
})

router.post('/addLeague', async function (req, res, next) {
    const leagueUrl = req.body.leagueUrl;
    const leagueAlias = req.body.leagueAlias;
    const tempArray = leagueUrl.split("/");
    const leagueId = tempArray[tempArray.length - 2];
    await newLeague({
        _id: leagueId,
        alias: leagueAlias,
        oddsportalUrl: leagueUrl
    })
    res.send("League added to database");
})

export default router;