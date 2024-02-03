import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

export default function AdditionalTools() {

    //0: not searching for match, 1: searching, 2: search complete
    const [isMatchSearching, setMatchSearching] = React.useState(0);
    const [matchSearchResult, setMatchSearchResult] = React.useState();
    const [isLeagueSearching, setLeagueSearching] = React.useState(0);
    const [leagueSearchResult, setLeagueSearchResult] = React.useState();

    async function submitMatchUrl(event) {
        event.preventDefault();
        const url = event.target.matchOddsportalUrl.value;
        setMatchSearching(1);
        const response = await axios.post('http://localhost:9000/matches/addMatchViaUrl', {url: url});
        setMatchSearching(2);
        setMatchSearchResult(response.data);
        console.log(response.data);
    }

    async function submitLeagueUrl(event) {
        event.preventDefault();
        const url = event.target.leagueOddsportalUrl.value;
        const alias = event.target.leagueAlias.value;
        setLeagueSearching(1);
        const response = await axios.post('http://localhost:9000/leagues/addLeague', {leagueUrl: url, leagueAlias: alias});
        setLeagueSearching(2);
        setLeagueSearchResult(response.data);
        console.log(response.data);
    }

    return (
        <div>
            <NavBar />
            <h1 className="page-title">Additional Tools</h1>
            <h3>Manually Add Match</h3>
            <form onSubmit={submitMatchUrl}>
                <label htmlFor="oddsportalUrl">Match Oddsportal URL</label>
                <input type="text" name="matchOddsportalUrl" />
                <button type="submit">Submit</button>
            </form>
            {
                isMatchSearching === 1 ? (
                    <p>Searching for match...</p>
                ) : isMatchSearching === 2 ? (
                    <p>{matchSearchResult}</p>
                ) : null
            }
            <form onSubmit={submitLeagueUrl} >
                <label htmlFor="leagueOddsportalUrl">League Oddsportal URL</label>
                <input type="text" name="leagueOddsportalUrl" />
                <label htmlFor="leagueAlias">League Alias</label>
                <input type="text" name="leagueAlias" />
                <button type="submit">Submit</button>
            </form>
            {
                isLeagueSearching === 1 ? (
                    <p>Adding league...</p>
                ) : isMatchSearching === 2 ? (
                    <p>{leagueSearchResult}</p>
                ) : null
            }
        </div>
    )
}