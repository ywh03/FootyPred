import React from "react";
import MatchPopup from "./MatchPopup";

export default function Match(props) {

    const [match, setMatch] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [popupOpen, setPopupOpen] = React.useState(false);

    React.useEffect(() => {
        console.log(props);
        setMatch(props.matchDetails);
        console.log(match);
        setLoading(false);
    }, []);

    function convertISOtoLocalDate(isoDate) {
        const utcDate = new Date(isoDate);
        const localDate = utcDate.toLocaleString();
        return localDate;
    }

    function togglePopup() {
        setPopupOpen(!popupOpen);
    }

    return (
        <div>
            {
                isLoading ? (
                    <div>
                        <p>Matches Loading...</p>
                    </div>
                ) : (
                    <div key={match._id} className="container match-row" onClick={togglePopup}>
                        <p>{convertISOtoLocalDate(match.date)}</p>
                        <p>{match.homeTeam}<b>
                        { match.hasOwnProperty('actlHomeScore') ?
                            <span> {match.actlHomeScore} - {match.actlAwayScore} </span> :
                            <span> - </span>
                        }
                        </b>{match.awayTeam}</p>
                        <p className={
                            match.actlHomeScore === undefined ? null : match.actlHomeScore === match.predHomeScore && match.actlAwayScore === match.predAwayScore ? "correct-prediction" : "incorrect-prediction"
                        } >{match.predHomeScore} - {match.predAwayScore}</p>
                        {
                            props.hasOwnProperty("matchTime") ? (
                                <p>matchTime</p>
                            ) : null
                        }
                        <p className={ match.hasOwnProperty('actlHomeScore') && match.hasOwnProperty('predHomeScore') && match.actlHomeScore > match.actlAwayScore && match.predHomeScore > match.predAwayScore ? "correct-prediction" : match.hasOwnProperty('actlHomeScore') && match.hasOwnProperty('predHomeScore') && match.predHomeScore > match.predAwayScore ? "incorrect-prediction" : null }>{match.homeProb}</p>
                        <p className={ match.hasOwnProperty('actlHomeScore') && match.hasOwnProperty('predHomeScore') && match.actlHomeScore === match.actlAwayScore && match.predHomeScore === match.predAwayScore ? "correct-prediction" : match.hasOwnProperty('actlHomeScore') && match.hasOwnProperty('predHomeScore') && match.predHomeScore === match.predAwayScore ? "incorrect-prediction" : null }>{match.drawProb}</p>
                        <p className={ match.hasOwnProperty('actlHomeScore') && match.hasOwnProperty('predHomeScore') && match.actlHomeScore < match.actlAwayScore && match.predHomeScore < match.predAwayScore ? "correct-prediction" : match.hasOwnProperty('actlHomeScore') && match.hasOwnProperty('predHomeScore') && match.predHomeScore < match.predAwayScore ? "incorrect-prediction" : null }>{match.awayProb}</p>
                    </div> 
                )
            }
            <div>
                {
                    popupOpen ? (
                        <MatchPopup matchId={match._id} homeTeam={props.homeTeam} awayTeam={props.awayTeam}/>
                    ) : null
                }
            </div>
        </div>
    )
}