import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

//TODO: Insert match via oddsportal link (or implement search functionality)
//TODO: Implement an importer from CSV
//TODO: Reload button on individual matches to check if they are ongoing / should I make it to search odds
//TODO: Implement a stats page

export default function Home() {
    const [isLoading, setLoading] = React.useState(true);
    const [upcomingMatches, setUpcomingMatches] = React.useState();

    async function getPastMatches() {
        const rawUpcomingMatches = await axios.get('http://localhost:9000/matches/upcomingmatches');
        setUpcomingMatches(rawUpcomingMatches.data);
        setLoading(false);
    }

    React.useEffect(() => {
        getPastMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <h1>Upcoming Matches</h1>
            <UpdateButton />
            {
                isLoading ? (
                    <h2>Matches Loading...</h2>
                ) : (
                    <MatchDisplay isPast={false} wantHidden={false} matches={upcomingMatches} setMatches={setUpcomingMatches} />
                )
            }
        </div>
    )
}