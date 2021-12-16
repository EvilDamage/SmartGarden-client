import {useState} from "react";

const NavBar = () =>{
    const [userName, setUserName] = useState('User')

    return (
        <div id={'navbar'}>
            Witaj {userName}
        </div>
    )
}

export default NavBar;
