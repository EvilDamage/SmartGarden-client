import {MdOutlineSpaceDashboard} from 'react-icons/md'
import {AiOutlineBarChart, AiOutlinePoweroff} from 'react-icons/ai'
import {IoSettingsOutline} from 'react-icons/io5'
import {RiPlantLine} from 'react-icons/ri'


const SideBar = () => {

    const pathName = window.location.pathname

    return (
        <div id={'sidebar'} className={''}>
            <div className={'sidebar-logo'}>
                SG
            </div>
            <div className={'sidebar-nav'}>
                <a href={'/'} className={pathName === '/' && 'active'}><MdOutlineSpaceDashboard/></a>
                <a href={'/plans'} className={pathName === '/plans' && 'active'}><RiPlantLine/></a>
                <a href={'/stats'} className={pathName === '/stats' && 'active'}><AiOutlineBarChart/></a>
                <a href={'/settings'} className={pathName === '/settings' && 'active'}><IoSettingsOutline/></a>
                {/*<span className={'logout'}><AiOutlinePoweroff/></span>*/}
            </div>
        </div>
    )
}

export default SideBar;
