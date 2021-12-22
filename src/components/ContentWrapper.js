import React, {useState} from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const ContentWrapper = (props) => {
    const [tabKey, setTabKey] = useState('home');

    return (
        <div id={'dashboard'}>
            <SideBar tabKey={tabKey} setKey={setTabKey}/>
            <div className={'main-content'}>
                <NavBar/>
                {props.children}
            </div>
        </div>
    )
}

export default ContentWrapper;
