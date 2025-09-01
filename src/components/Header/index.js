import {Link, withRouter} from 'react-router-dom'
import { AiFillHome } from "react-icons/ai";
import { BsBriefcaseFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import Cookies from 'js-cookie'
import './index.css'

const Header =(props)=>{

    const onLogout=()=>{
        const {history} = props
        Cookies.remove('jwt_token')
        history.replace('/login')
    }

    return(
        <nav className='navbar-container'>
            <Link to='/'>
                <img src='https://assets.ccbp.in/frontend/react-js/logo-img.png' alt="website logo" className='navbar-logo'/>
            </Link>
            <div className='nav-items-container-mobile'>
                <Link to='/'>
                    <AiFillHome  className='nav-icon-mobile'/>
                </Link>
                <Link to='/jobs'>
                    <BsBriefcaseFill className='nav-icon-mobile'/>
                </Link>
                <button className='logout-btn-mobile' onClick={onLogout}>
                    <MdLogout className='nav-icon-mobile'/>
                </button>
            </div>
            <div className='nav-items-container-desktop'>
                <Link to='/' className='nav-link-desktop'>
                    Home
                </Link>
                <Link to='/jobs' className='nav-link-desktop'>
                    Jobs
                </Link>
            </div>
            <button type='button' className='logout-btn-desktop' onClick={onLogout}>Logout</button>
        </nav>
    )
}
export default withRouter(Header)