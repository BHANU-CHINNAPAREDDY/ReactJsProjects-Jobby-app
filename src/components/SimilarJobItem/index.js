import { MdStar } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { BsBriefcaseFill } from "react-icons/bs";

import './index.css'
import { Link } from "react-router-dom";

const SimilarJobItem = props=>{
    const {jobDetails} = props
    const {companyLogoUrl, employmentType, id, jobDescription, location, rating, title} = jobDetails
    return(
        <Link to={`/jobs/${id}`} className='similar-job-link'>
            <div className='similar-job-container'>
                <div className='similar-job-logo-title-container'>
                    <img src={companyLogoUrl} alt='similar job company logo' className='similar-job-company-logo'/>
                    <div className='similar-job-title-rating-container'>
                        <h4 className='similar-job-title'>{title}</h4>
                        <p className='similar-job-rating'><MdStar className="similar-job-rating-icon"/>{rating}</p>
                    </div>
                </div>
                <div className="similar-job-description">
                    <p>Description</p>
                    {jobDescription}
                </div>
                <div className="similar-job-location-type-container">
                    <p className='job-details-location'>
                        <MdLocationPin className='similar-job-details-icon'/>
                        {location}
                    </p>
                    <p className='job-details-employment-type'>
                        <BsBriefcaseFill className='similar-job-details-icon'/>
                        {employmentType}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default SimilarJobItem