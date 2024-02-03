import React from "react";
import axios from "axios";
import { convertLeagueNameToFull } from "./GeneralUtilities.js";

export default function UpdateButton(props) {

    const leaguesToScrape = [
        "premier-league",
        "bundesliga",
        "laliga",
        "champions-league"
    ];

    const [isUpdating, setUpdating] = React.useState(false);
    const [nowScraping, setNowScraping] = React.useState();

    async function updateNextMatches() {
        setUpdating(true);
        let allMatches = [];
        for (const league of leaguesToScrape) {
            setNowScraping(convertLeagueNameToFull(league));
            const params = {
                league: league,
            }
            const nextMatches = await axios.get('http://localhost:9000/scrape/nextMatches', { params } );
            allMatches.push(...nextMatches.data);
        }
        setNowScraping();
        console.log("Next matches found; adding next");
        //console.log(nextMatches.data);
        const matchUpdateStatus = await axios.post('http://localhost:9000/matches/checkMatchesAndAdd', {matches: allMatches});
        console.log(matchUpdateStatus.data.status);
        await props.pageMatchUpdate();
        setUpdating(false);
    }

    return (
        <div>
            <button className="btn btn-primary" onClick={updateNextMatches}>{isUpdating ? "Updating" : "Update"}</button>
            {
                nowScraping ? <p>Now Scraping: {nowScraping}</p> : null
            }
        </div>
    )
}