import { Link } from 'react-router-dom'
import { MdStar } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { BsBriefcaseFill } from "react-icons/bs";
import './index.css'

const JobItem = props=>{
    const {jobDetails} = props
    const {companyLogoUrl, employmentType, id, jobDescription, location, packagePerAnnum, rating, title }= jobDetails
    return(
        <Link to={`/jobs/${id}`} className="job-item-link">
            <div className='job-item-container'>
                <div className='logo-title-container'>
                    <img src={companyLogoUrl} alt='company logo' className='company-logo'/>
                    <div className='title-rating-container'>
                        <h1 className='job-title'>{title}</h1>
                        <p className='job-rating'><MdStar className='rating-icon'/>{rating}</p>
                    </div>
                </div>
                <div className='location-type-lpa-container'>
                    <p className='location'>
                        <MdLocationPin className='job-details-icon'/>
                        {location}
                    </p>
                    <p className='employment-type'>
                        <BsBriefcaseFill className='job-details-icon'/>
                        {employmentType}
                    </p>
                    <p className='lpa'>
                        {packagePerAnnum}
                    </p>
                </div>
                <hr className='separator'/>
                <p className='description'>
                    Description <br/> <br/>
                    {jobDescription}
                </p>
            </div>
        </Link>
    )
}
export default JobItem