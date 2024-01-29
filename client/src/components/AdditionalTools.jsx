import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

export default function AdditionalTools() {

    return (
        <div>
            <NavBar />
            <h1>Additional Tools</h1>
            <h3>Manually Add Match</h3>
            <form>
                <label htmlFor="oddsportalUrl">Oddsportal URL</label>
                <input type="text" name="oddsportalUrl" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}