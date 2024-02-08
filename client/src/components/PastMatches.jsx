import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

//TODO: Reverse past matches display order
export default function PastMatches() {

    const [isLoading, setLoading] = React.useState(true);
    const [pastMatches, setPastMatches] = React.useState();

    async function getPastMatches() {
        const rawPastMatches = await axios.get('http://localhost:9000/matches/pastmatches');
        let pastMatches = [];
        for (const match of rawPastMatches.data) {
            if (!match.hasOwnProperty('predHomeScore')) {
                axios.post('http://localhost:9000/matches/toggleMatch', {matchId: match._id, hidden: true});
            } else {
                pastMatches.push(match);
            }
        }
        setPastMatches(pastMatches.reverse());
        setLoading(false);
    }

    React.useEffect(() => {
        getPastMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <h1 className="page-title">Past Matches</h1>
            {
                isLoading ? (
                    <h2 className="matches-loading-prompt">Matches Loading...</h2>
                ) : (
                    <MatchDisplay isPast={true} matches={pastMatches} setMatches={setPastMatches} />
                )
            }
        </div>
    )
}