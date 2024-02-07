import React from "react";
import axios from "axios";
import { convertLeagueNameToFull } from "./GeneralUtilities.js";

export default function UpdateButton(props) {

    const [isUpdating, setUpdating] = React.useState(false);
    const [nowScraping, setNowScraping] = React.useState();

    async function getLeagues() {
        setNowScraping("Leagues Database");
        const response = await axios.get('http://localhost:9000/leagues');
        if (response.data.statusCode === 500) {
            console.log("Server error getting all leagues");
            return;
        }
        return response.data.leagues;
    }

    async function updateNextMatches() {
        const allLeagues = await getLeagues();
        setUpdating(true);
        let allMatches = [];
        let errorLeagues = [];
        for (const league of allLeagues) {
            if (league.followStatus === "no-scrape") continue;
            setNowScraping(league.alias);
            const params = {
                league: league._id,
            }
            const nextMatches = await axios.get('http://localhost:9000/scrape/nextMatches', { params } );
            console.log(nextMatches.data);
            if (nextMatches.data.statusCode === 500) {
                errorLeagues.push(league.alias);
                continue;
            }
            for (const match of nextMatches.data.matches) {
                match["hidden"] = league.followStatus === "default-in" ? false : true;
            }
            allMatches.push(...nextMatches.data.matches);
        }
        if (errorLeagues.length > 0) {
            setNowScraping();
        } else {
            setNowScraping("Errors scraping: " + errorLeagues.join(", "));
        }
        
        console.log("Next matches found; adding next");
        //console.log(nextMatches.data);
        const matchUpdateStatus = await axios.post('http://localhost:9000/matches/checkMatchesAndAdd', {matches: allMatches});
        console.log(matchUpdateStatus.data.status);
        await props.pageMatchUpdate();
        setUpdating(false);
    }

    return (
        <div className="update-button">
            <button className="btn btn-primary" onClick={updateNextMatches}>{isUpdating ? "Updating" : "Update"}</button>
            {
                nowScraping ? <p>Now Scraping: {nowScraping}</p> : null
            }
        </div>
    )
}