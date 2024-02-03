import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

export default function AdditionalTools() {

    //0: not searching for match, 1: searching, 2: search complete
    const [isSearching, setSearching] = React.useState(0);
    const [searchResult, setSearchResult] = React.useState();

    async function submitUrl(event) {
        event.preventDefault();
        const url = event.target.oddsportalUrl.value;
        setSearching(1);
        const response = await axios.post('http://localhost:9000/matches/addMatchViaUrl', {url: url});
        setSearching(2);
        setSearchResult(response.data);
        console.log(response.data);
    }

    return (
        <div>
            <NavBar />
            <h1 className="page-title">Additional Tools</h1>
            <h3>Manually Add Match</h3>
            <form onSubmit={submitUrl}>
                <label htmlFor="oddsportalUrl">Oddsportal URL</label>
                <input type="text" name="oddsportalUrl" />
                <button type="submit">Submit</button>
            </form>
            {
                isSearching === 1 ? (
                    <p>Searching for match...</p>
                ) : isSearching === 2 ? (
                    <p>{searchResult}</p>
                ) : null
            }
        </div>
    )
}