import React from "react";
import axios from "axios";
import Match from "./Match.jsx";

const HOUR_DIFF = 2;

function MatchDisplay(props) {

    const [isMatchUpdating, setMatchUpdating] = React.useState({});

    function compareDate(date) {
        const currentDate = new Date();
        //NOTE: Use this hour_diff to fix the FIXME in this page
        const matchDate = new Date(date);
        if (currentDate > matchDate) {
            return true;
        } 
        return false;
    }

    async function updateMatch(matchId, index) {
        let tempMatchUpdating = {...isMatchUpdating};
        tempMatchUpdating[index] = true;
        setMatchUpdating(tempMatchUpdating);
        const rawMatchResults = await axios.post('http://localhost:9000/matches', {"matchId": matchId});
        const matchResults = rawMatchResults.data;
        if (matchResults === "Error in opening page") return;
        if (matchResults.matchStatus !== "Uncommenced") {
            props.setMatches((prevArray) => {
                const updatedArray = [...prevArray];
                //const object = {...updatedArray[index], actlHomeTeamScore: matchResults.actlHomeTeamScore, actlAwayTeamScore: matchResults.actlAwayTeamScore};
                const object = updatedArray[index];
                object.actlHomeScore = matchResults.actlHomeTeamScore;
                object.actlAwayScore = matchResults.actlAwayTeamScore;
                object.matchStatus = matchResults.matchStatus;
                updatedArray[index] = object;
                return updatedArray;
            });
        }
        tempMatchUpdating = {...isMatchUpdating};
        tempMatchUpdating[index] = false;
        setMatchUpdating(tempMatchUpdating);
    }

    async function checkMatchesForUpdates() {
        //console.log(allMatches.data);
        for (const [index, match] of props.matches.entries()) {
            console.log(match);
            const matchDate = match.date;
            if (compareDate(matchDate) && match.matchStatus !== "Completed") {
                console.log(match);
                await updateMatch(match._id, index);
            }
        }
        return;
    }

    async function toggleMatch(matchId, index) {
        await axios.post('http://localhost:9000/matches/toggleMatch', {"matchId": matchId, "updatedHidden": !props.wantHidden});
        console.log("Match " + matchId + " hidden in database");
        props.setMatches((prevArray) => {
            const updatedArray = [...prevArray];
            let object = updatedArray[index];
            object = null;
            updatedArray[index] = object;
            return updatedArray;
        })
        console.log(props.matches);
    }

    React.useEffect(() => {
        checkMatchesForUpdates();
    }, [])

    return (
        <div className="match-table">
            <div className={`match-row match-table-column-headers ${props.isPast ? 'match-row-past' : 'match-row' }`}>
                { props.isPast ? null : props.wantHidden ? <p className="match-row-item match-row-remove-button">Add</p> : <p className="match-row-item match-row-remove-button">Remove</p> }
                <p className="match-row-item match-row-date">Date & Time</p>
                <p className="match-row-item match-row-competition">Competition</p>
                <p className="match-row-item match-row-match">Match</p>
                <p className="match-row-item match-row-prediction">Predictions</p>
                <p className="match-row-item match-row-odd">1</p>
                <p className="match-row-item match-row-odd">X</p>
                <p className="match-row-item match-row-odd">2</p>
            </div>
            <div>
            { props.matches.map(function(match, index) {
                return (
                    <div className={index % 2 === 0 ? "match-row-grey" : "match-row-white"}>
                    {
                        match ? <Match matchDetails={match} index={index} removeMatch={toggleMatch} isMatchUpdating={isMatchUpdating[index]} wantHidden={props.wantHidden} isPast={props.isPast} setMatches={props.setMatches} /> : null
                    }
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default MatchDisplay;