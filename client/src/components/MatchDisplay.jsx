import React from "react";
import axios from "axios";
import Match from "./Match.jsx";

const HOUR_DIFF = 2;

function MatchDisplay() {

    const [allMatches, setAllMatches] = React.useState();
    const [isMatchesLoading, setMatchesLoading] = React.useState(true);
    const [isFetchComplete, setFetchComplete] = React.useState(false);

    async function getAllMatches() {
        const matches = await axios.get('http://localhost:9000/matches');
        console.log(matches);
        setAllMatches(matches);
        setMatchesLoading(false);
        setFetchComplete(true);
        console.log("Fetch complete")
    }

    function compareDate(date) {
        const currentDate = new Date();
        const matchDate = new Date(date);
        if (currentDate > matchDate) {
            return true;
        } 
        return false;
    }

    async function updateMatch(matchId, index) {
        const matchResults = await axios.post('http://localhost:9000/matches', {"matchId": matchId});
        if (matchResults.matchStatus === "Completed") {
            setAllMatches((prevArray) => {
                const updatedArray = [...prevArray];
                const object = {...updatedArray[index], actlHomeScore: matchResults.homeScore, actlAwayScore: matchResults.awayScore};
                updatedArray[index] = object;
                return updatedArray;
            });
        }
        else if (matchResults.matchStatus === "Ongoing") {
            setAllMatches((prevArray) => {
                const updatedArray = [...prevArray];
                const object = {...updatedArray[index], actlHomeScore: matchResults.homeScore, actlAwayScore: matchResults.awayScore, matchTime: matchResults.matchTime};
                updatedArray[index] = object;
                return updatedArray;
            });
        }
    }

    async function checkMatchesForUpdates() {
        //console.log(allMatches.data);
        for (const [index, match] of allMatches.data.entries()) {
            //console.log(match);
            const matchDate = match.date;
            if (compareDate(matchDate) && !match.hasOwnProperty("actlHomeScore")) {
                console.log(match._id);
                updateMatch(match._id, index);
            }
        }
    }

    React.useEffect(() => {

        async function getAndUpdateMatches() {
            await getAllMatches();
        }

        setMatchesLoading(true);
        getAndUpdateMatches();
    }, []);

    React.useEffect(() => {
        console.log("isFetchComplete state changed to " + isFetchComplete);
        if (isFetchComplete) {
            console.log("Checking matches for updates");
            checkMatchesForUpdates();
        }
    }, [isFetchComplete]);

    return (
        <div className="match-table">
            <div className="match-table-column-headings match-row">
                <p>Date & Time</p>
                <p>Match</p>
                <p>Predictions</p>
                <p>1</p>
                <p>X</p>
                <p>2</p>
            </div>
            { isMatchesLoading ? (
                <div>
                    <h1>Matches Loading</h1>
                </div> 
                ) : (
                <div>
                { allMatches.data.map(function(match) {
                    return (
                        <Match matchDetails={match} />
                    )
                })}
                </div>
                )
            }
        </div>
    )
}

export default MatchDisplay;