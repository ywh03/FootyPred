import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

//TODO: remove deleted matches that have already passed

export default function DeletedMatches() {
    const [isLoading, setLoading] = React.useState(true);
    const [deletedMatches, setDeletedMatches] = React.useState();

    async function getDeletedMatches() {
        const rawDeletedMatches = await axios.get('http://localhost:9000/matches/deletedmatches');
        setDeletedMatches(rawDeletedMatches.data);
        setLoading(false);
    }

    React.useEffect(() => {
        getDeletedMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <h1 className="page-title">Deleted Matches</h1>
            <UpdateButton pageMatchUpdate={getDeletedMatches} />
            {
                isLoading ? (
                    <h2>Matches Loading...</h2>
                ) : (
                    <MatchDisplay isPast={false} wantHidden={true} matches={deletedMatches} setMatches={setDeletedMatches} />
                )
            }
        </div>
    )
}