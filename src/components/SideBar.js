import {MdOutlineSpaceDashboard} from 'react-icons/md'
import {AiOutlineBarChart, AiOutlinePoweroff} from 'react-icons/ai'
import {IoSettingsOutline} from 'react-icons/io5'
import {RiPlantLine} from 'react-icons/ri'


const SideBar = () => {



    return (
        <div id={'sidebar'} className={''}>
            <div className={'sidebar-logo'}>
                SG
            </div>
            <div className={'sidebar-nav'}>
                <a href={'#'} className={'active'}><MdOutlineSpaceDashboard/></a>
                <a href={'#'}><RiPlantLine/></a>
                <a href={'#'}><AiOutlineBarChart/></a>
                <a href={'#'}><IoSettingsOutline/></a>
                <span className={'logout'}><AiOutlinePoweroff/></span>
            </div>
        </div>
    )
}

export default SideBar;
