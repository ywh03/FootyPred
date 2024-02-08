import React from "react";
import axios from "axios";

export default function MatchPopup(props) {

    async function submitPredScores(event) {
        event.preventDefault();
        props.setMatches((prevArray) => {
            const updatedArray = [...prevArray];
            let object = updatedArray[props.index];
            object["predHomeScore"] = event.target.predHomeScore.value;
            object["predAwayScore"] = event.target.predAwayScore.value;
            updatedArray[props.index] = object;
            return updatedArray;
        })
        props.togglePopup();
        const submittedPred = {
            "matchId": props.matchId,
            "predHomeScore": event.target.predHomeScore.value,
            "predAwayScore" : event.target.predAwayScore.value,
        }
        const response = await axios.post('http://localhost:9000/matches/updatepred', submittedPred);
        if (response.data.statusCode === 200) console.log("Prediction successfully updated");
        else console.log("Error updating prediction");
    }

    return (
        <div className="prediction-form">
            <form onSubmit={submitPredScores}>
                <div className="form-row">
                    <input className="prediction-form-field form-control-inline" type="number" name="predHomeScore" min="0" placeholder={props.homeTeam} />
                    <span> : </span>
                    <input className="prediction-form-field form-control-inline" type="number" name="predAwayScore" min="0" placeholder={props.awayTeam} />
                    <button className="prediction-button btn btn-success" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}