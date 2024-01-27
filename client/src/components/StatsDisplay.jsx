import React from "react";
import axios from "axios";

export default function StatsDisplay() {
    const [isLoading, setLoading] = React.useState(true);

    //TODO: Graph of gain over time

    async function getAllStats() {
        const allStats = await axios.get("http://localhost:9000/stats");
        console.log(allStats);
        setLoading(false);
    }

    React.useEffect(() => {
        getAllStats();
    }, [])

    return (
        <div>
            {
                isLoading ? (
                    <h2>Stats Loading...</h2>
                ) : (
                    <div></div>
                )
            }
        </div>
    )
}