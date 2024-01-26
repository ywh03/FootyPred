import React from "react";
import { Link } from "react-router-dom";

export default function NavBar () {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">FootyPred</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                     <li className="nav-item active">
                        <a className="nav-link" href="/">Active matches</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="deletedmatches">Deleted Matches</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Followed Teams</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Statistics</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}