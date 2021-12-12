import React, {useState} from "react";
import {useQuery} from "@apollo/client";
import {SENSOR_READS} from "../helpers/gqlQueries";


const Home = () => {

    const { data, loading, error } = useQuery(SENSOR_READS);

    console.log(data, error)

    return(
        <div>
            Home
        </div>
    )
}

export default Home;
