import { Component } from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { MdStar } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { BsBriefcaseFill } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import './index.css'
import Header from '../Header'
import FailureView from '../FailureView'
import SimilarJobItem from '../SimilarJobItem';

const apiStatusConstants ={
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE"
}

class JobDetailsPage extends Component{
    state={
        apiStatus: apiStatusConstants.initial,
        jobDetails:{},
        similarJobs:[]
    }
    componentDidMount(){
        this.getJobDetails()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getJobDetails()
            window.scrollTo(0, 0)
        }
    }

    getJobDetails = async ()=>{
        this.setState({
            apiStatus:apiStatusConstants.inProgress
        })
        const {match} = this.props
        const {params} = match
        const {id} = params
        const JwtToken = Cookies.get('jwt_token')
        const apiUrl = `https://apis.ccbp.in/jobs/${id}`
        const options = {
            method: "GET",
            headers:{
                Authorization : `Bearer ${JwtToken}`
            }
        }
        try{
            const response = await fetch(apiUrl, options)
            const responseData = await response.json()
            if (response.ok === true){
                // console.log(responseData)
                const jobDetails = responseData.job_details
                const updatedJobDetails = {
                    companyLogoUrl: jobDetails.company_logo_url,
                    companyWebsiteUrl : jobDetails.company_website_url,
                    employmentType: jobDetails.employment_type,
                    id: jobDetails.id,
                    jobDescription: jobDetails.job_description,
                    lifeAtCompany:{
                        description: jobDetails.life_at_company.description,
                        imageUrl: jobDetails.life_at_company.image_url
                    },
                    location: jobDetails.location,
                    packagePerAnnum: jobDetails.package_per_annum,
                    rating: jobDetails.rating,
                    skills: jobDetails.skills.map(eachSkill=>({
                        imageUrl : eachSkill.image_url,
                        name:eachSkill.name
                    })),
                    title: jobDetails.title
                }
                const similarJobs = responseData.similar_jobs
                const updatedSimilarJobs = similarJobs.map(eachJob=>({
                    companyLogoUrl: eachJob.company_logo_url,
                    employmentType: eachJob.employment_type,
                    id: eachJob.id,
                    jobDescription: eachJob.job_description,
                    location: eachJob.location,
                    rating: eachJob.rating,
                    title: eachJob.title
                }))

                this.setState({
                    jobDetails: updatedJobDetails,
                    similarJobs: updatedSimilarJobs,
                    apiStatus:apiStatusConstants.success
                })
            }
            else{
                this.setState({
                    apiStatus:apiStatusConstants.failure
                })
            }
        }
        catch{
            this.setState({
                apiStatus:apiStatusConstants.failure
            })
        }
    }

    tryAgain =()=>{
        this.getJobDetails()
    }

    renderJobDetails =()=>{
        const {jobDetails} = this.state
        const {companyLogoUrl, companyWebsiteUrl, employmentType, jobDescription, lifeAtCompany,
            location, packagePerAnnum, rating, skills, title } = jobDetails
        return(
            <div className='job-details-container'>
                <div className='logo-heading-container'>
                    <img src={companyLogoUrl} alt='job details company logo' className='job-details-company-logo'/>
                    <div className='job-details-title-rating-container'>
                        <h2 className='job-details-company-title'>{title}</h2>
                        <p className='job-details-company-rating'><MdStar className='rating-icon'/>{rating}</p>
                    </div>
                </div>
                <div className='job-details-location-type-lpa-container'>
                    <p className='job-details-location'>
                        <MdLocationPin className='job-details-icon'/>
                        {location}
                    </p>
                    <p className='job-details-employment-type'>
                        <BsBriefcaseFill className='job-details-icon'/>
                        {employmentType}
                    </p>
                    <p className='job-details-lpa'>
                        {packagePerAnnum}
                    </p>
                </div>
                <hr className='job-details-separator'/>
                <div className='job-details-description-container'>
                    <div className='description-and-link'>
                        <p className='job-details-sub-header'>Description</p>
                        <a href={companyWebsiteUrl} className='visit-link' target='__blank'>Visit <FaExternalLinkAlt className='visit-icon'/></a>
                    </div>
                    {jobDescription}
                </div>
                <div className='job-description-skills-list'>
                    <h3 className='job-details-skills-heading'>Skills</h3>
                    <ul className='skills-list'>
                        {skills.map(eachSkill=>(
                            <li className='skill-item' key={eachSkill.name}>
                                <img src={eachSkill.imageUrl} alt={eachSkill.name} className='skill-img'/>
                                <p className='skill-name'>{eachSkill.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='life-at-company'>
                    <h4 className='life-at-company-heading'>Life at Company</h4>
                    <div className='life-at-company-text-container'>
                        <p className='life-at-company-description'>{lifeAtCompany.description}</p>
                        <img src={lifeAtCompany.imageUrl} alt='life at company' className='life-at-comapany-img'/>
                    </div>
                </div>
            </div>
        )
    }

    renderSimilarJobDetails=()=>{
        const {similarJobs} = this.state
        return(
            <div className='similar-jobs-container'>
                <h1 className='similar-jobs-heading'>Similar Jobs</h1>
                <ul className='similar-jobs-list'>
                    {similarJobs.map(eachJob=><SimilarJobItem jobDetails={eachJob} key={eachJob.id}/>)}
                </ul>
            </div>
        )
    }

    renderLoadingView =()=>(
        <div className="loader-container-jobs-details">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
    )
    

    renderFinalView = ()=>{
        const {apiStatus} = this.state
        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return this.renderLoadingView()
            case apiStatusConstants.failure:
                return <FailureView tryAgain={this.tryAgain}/>
            case apiStatusConstants.success:
                return( 
                    <>
                        {this.renderJobDetails()}
                        {this.renderSimilarJobDetails()}
                    </>
                )
            default:
                return null
        }
    }
    
    render(){
        return(
            <>
                <Header/>
                <div className='job-details-page-container'>
                    {this.renderFinalView()}
                </div>
            </>
        )
    }
}
export default JobDetailsPage