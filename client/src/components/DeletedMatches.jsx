import React from "react";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

export default function Home() {
    return (
        <div>
            <NavBar />
            <h1>DeletedMatches</h1>
            <UpdateButton />
            <MatchDisplay wantHidden={true} />
        </div>
    )
}