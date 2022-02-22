import {MdOutlineSpaceDashboard} from 'react-icons/md'
import {AiOutlineBarChart} from 'react-icons/ai'
import {IoSettingsOutline} from 'react-icons/io5'
import {RiPlantLine} from 'react-icons/ri'
import {FaLeaf} from "react-icons/all";

const SideBar = () => {
    const pathName = window.location.pathname

    return (
        <div id={'sidebar'} className={''}>
            <div className={'sidebar-logo'}>
                <FaLeaf style={{color: '#064635', fontSize: '34px', marginTop: '30px'}}/>
            </div>
            <div className={'sidebar-nav'}>
                <a href={'/'} className={pathName === '/' && 'active'}><MdOutlineSpaceDashboard/></a>
                <a href={'/plans'} className={pathName === '/plans' && 'active'}><RiPlantLine/></a>
                <a href={'/stats'} className={pathName === '/stats' && 'active'}><AiOutlineBarChart/></a>
                <a href={'/settings'} className={pathName === '/settings' && 'active'}><IoSettingsOutline/></a>
            </div>
        </div>
    )
}

export default SideBar;
