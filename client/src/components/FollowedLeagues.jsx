import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";

export default function FollowedLeagues () {

    const [allLeagues, setAllLeagues] = React.useState();
    const [isLeaguesLoading, setLeaguesLoading] = React.useState(true);

    async function getAllLeagues() {
        const leagues = await axios.get('http://localhost:9000/leagues');
        setAllLeagues(leagues.data);
        setLeaguesLoading(false);
    }

    React.useEffect(() => {
        getAllLeagues();
    }, [])

    return (
        <div>
            <NavBar />
            {
                isLeaguesLoading ? (
                    <p>Leagues Loading...</p>
                ) : (
                    <div>
                        {
                            allLeagues.map(function(league) {
                                return (
                                    <div>
                                        <p>{league.alias}</p>
                                        <p>{league.followStatus}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}