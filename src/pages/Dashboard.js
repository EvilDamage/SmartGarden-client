import React, {useState} from "react";
import {useQuery} from "@apollo/client";
import {SENSOR_READS} from "../helpers/gqlQueries";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";


const Dashboard = () => {

    const { data, loading, error } = useQuery(SENSOR_READS);

    console.log(data, error)

    return(
        <div id={'dashboard'}>
            <SideBar/>
            <div className={'main-content'}>
                <NavBar/>
                <div className={'container'}>
                    dashboard
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
