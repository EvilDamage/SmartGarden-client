import {useState} from "react";
import {Dropdown} from 'react-bootstrap';

const NavBar = () => {
    const [userName, setUserName] = useState(localStorage.getItem('user'))

    return (
        <div id={'navbar'}>
            <Dropdown>
                <Dropdown.Toggle variant="success mt-0" id="dropdown-basic" className={'user-nav'}>
                    {/*<img className={'avatar'}*/}
                    {/*     src={'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png'}*/}
                    {/*     alt={'avatar'}/>*/}
                    <span>{userName}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className={'dropdown'}>
                    <Dropdown.Item href="/users">Zarządzaj</Dropdown.Item>
                    <Dropdown.Item href="/login" onClick={()=>{
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                    }}>Wyloguj</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default NavBar;
