import React from 'react';
import Home from './Home.jsx';
import DeletedMatches from './DeletedMatches.jsx';
import {createBrowserRouter, RouterProvider, Routes, Route, Link} from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", Component: Home },
    { path: "/deletedmatches", Component: DeletedMatches },
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