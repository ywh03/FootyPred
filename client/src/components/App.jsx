import React from 'react';
import Home from './Home.jsx';
import PastMatches from './PastMatches.jsx';
import DeletedMatches from './DeletedMatches.jsx';
import Stats from './Stats.jsx';
import AdditionalTools from './AdditionalTools.jsx';
import FollowedLeagues from './FollowedLeagues.jsx';
import {createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", Component: Home },
    { path: "/pastmatches", Component: PastMatches },
    { path: "/deletedmatches", Component: DeletedMatches },
    { path: "/followedleagues", Component: FollowedLeagues },
    { path: "/stats", Component: Stats },
    { path: "/addtools", Component: AdditionalTools },
    { path: "*", Component: Root },
]);

export default function App() {
    return <RouterProvider router={router} />;
}

function Root(){
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deletedmatches" element={<DeletedMatches />} />
        </Routes>
    )
}