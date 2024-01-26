import React from "react";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

//TODO: Insert natch via oddsportal link (or implement search functionality)
//TODO: Implement an importer from CSV
//TODO: Reload button on individual matches to check if they are ongoing / should I make it to search odds
//TODO: Implement a stats page

export default function Home() {
    return (
        <div>
            <NavBar />
            <h1>Matches</h1>
            <UpdateButton />
            <MatchDisplay wantHidden={false} />
        </div>
    )
}