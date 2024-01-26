import React from "react";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

export default function Home() {
    return (
        <div>
            <h1>Test</h1>
            <UpdateButton />
            <MatchDisplay wantHidden={false} />
        </div>
    )
}