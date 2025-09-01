import { Component } from 'react'
import { BsSearch } from "react-icons/bs";
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import UserProfile from '../UserProfile';
import JobItem from '../JobItem';
import FailureView from '../FailureView';

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants ={
    initial :"INITIAL",
    success :"SUCCESS",
    failure : "FAILURE",
    inProgress :"IN_PROGRESS"
}

class JobsPage extends Component{

    state={
        userSearchInput:'',
        employmentType:[],
        salaryRange:'',
        jobs:[], 
        apiStatus: apiStatusConstants.initial
    }

    componentDidMount(){
        this.getJobs()
    }

    getJobs=async ()=>{
        this.setState({
            apiStatus: apiStatusConstants.inProgress
        })
        const {employmentType, salaryRange, userSearchInput} = this.state
        const employmentTypes = employmentType.join()

        const jwtToken = Cookies.get('jwt_token')

        const options ={
            method :"GET",
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        }
        try{
            const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${salaryRange}&search=${userSearchInput}`
            const response = await fetch(apiUrl, options)
            const responseData = await response.json()
            if (response.ok === true){
                const jobs = responseData.jobs
                const updatedJobs = jobs.map(eachJob=>({
                    companyLogoUrl : eachJob.company_logo_url,
                    employmentType: eachJob.employment_type,
                    id: eachJob.id,
                    jobDescription: eachJob.job_description,
                    location: eachJob.location,
                    packagePerAnnum: eachJob.package_per_annum,
                    rating: eachJob.rating,
                    title: eachJob.title
                }))
                this.setState({
                    jobs: updatedJobs,
                    apiStatus: apiStatusConstants.success
                })
                // console.log(updatedJobs)
            }
            else{
                this.setState({
                    apiStatus: apiStatusConstants.failure
                })
            }
        }
        catch(error){
            this.setState({
                apiStatus:apiStatusConstants.failure
            })
        }
    }

    onChangeuserSearchInput =event=>{
        this.setState({
            userSearchInput: event.target.value
        })
    }

    onSearchJobs=()=>{
        this.getJobs()
    }

    renderJobsSearchBar =()=>{
        const {userSearchInput} = this.state
        return (
            <div className='job-search-container'>
                <input type='search' placeholder='Search' value={userSearchInput} className='user-search-input' onChange={this.onChangeuserSearchInput}/>
                <div className='search-icon-container'  onClick={this.onSearchJobs}>
                    <BsSearch className='search-icon'/>
                </div>

            </div>
        ) 
    }

    onChangeEmploymentType = event=>{
        const {employmentType} = this.state
        const selectedEmploymentType = event.target.value
        
        if(event.target.checked === true){
            if(!employmentType.includes(selectedEmploymentType)){
                this.setState({
                    employmentType: [...employmentType, selectedEmploymentType]
                }, this.getJobs)
            }
        }
        else{
            if(employmentType.includes(selectedEmploymentType)){
                const updatedSelectedEmploymentTypes = employmentType.filter(eachEmploymentType=> eachEmploymentType!==selectedEmploymentType)
                this.setState({
                    employmentType: updatedSelectedEmploymentTypes
                }, this.getJobs)
            }
        }
    }

    renderTypeOfEmploymentSection=()=>{
        const {employmentType} = this.state
        return(
            <div className='filter-section-container'>
                <h2 className='filter-section-header'>
                    Type of Employment
                </h2>
                <ul className='filters-list'>
                    {employmentTypesList.map(eachEmploymentType =><div className='filter-item' key={eachEmploymentType.label}>
                        <input type='checkbox' value={eachEmploymentType.employmentTypeId} id={eachEmploymentType.employmentTypeId} className='filter-checkbox' onChange={this.onChangeEmploymentType} checked={employmentType.includes(eachEmploymentType.employmentTypeId)}/>
                        <label htmlFor={eachEmploymentType.employmentTypeId} className='filter-checkbox-label'>{eachEmploymentType.label}</label>
                    </div>)}
                </ul>
            </div>
        )
    }

    onChangeSalaryRange=event=>{
        if(event.target.checked === true){
            this.setState({
                salaryRange: event.target.value
            }, this.getJobs)
        }
    }

    renderSalaryRangeSection =()=>{
        const {salaryRange} = this.state
        return(
            <div className='filter-section-container'>
                <h2 className='filter-section-header'>
                    Salary range
                </h2>
                <ul className='filters-list'>
                    {salaryRangesList.map(eachSalaryRange =><div className='filter-item' key={eachSalaryRange.salaryRangeId}>
                        <input type='radio' name='salaryRange' value={eachSalaryRange.salaryRangeId} id={eachSalaryRange.salaryRangeId} className='filter-checkbox' onChange={this.onChangeSalaryRange} checked={eachSalaryRange.salaryRangeId === salaryRange}/>
                        <label htmlFor={eachSalaryRange.salaryRangeId} className='filter-checkbox-label'>{eachSalaryRange.label}</label>
                    </div>)}
                </ul>
            </div>
        )
    }

    renderJobFiltersSection =()=>(
        <>
            {this.renderTypeOfEmploymentSection()}
            {this.renderSalaryRangeSection()}
        </>
    )

    renderLoadingView =()=>(
        <div className="loader-container-jobs">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
    )

    renderNoJobsView =()=>(
        <div className='no-jobs-container'>
            <img src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png' alt='no jobs' className='no-jobs-img'/>
            <h3 className='no-jobs-heading'>No Jobs Found</h3>
            <p className='no-jobs-description'>We could not find any jobs. Try other filters.</p>
        </div>
    )

    renderJobsView =()=>{
        const{jobs} = this.state
        if(jobs.length>0){
            return(
                <ul className='jobs-list'>
                    {jobs.map(eachJob=><JobItem jobDetails={eachJob} key={eachJob.id}/>)}
                </ul>
            )
        }
        else{
            return this.renderNoJobsView()
        }
    }

    renderJobs =()=>{
        const{apiStatus} = this.state
        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return this.renderLoadingView()
            case apiStatusConstants.failure:
                return <FailureView tryAgain={this.getJobs}/>
            case apiStatusConstants.success:
                return this.renderJobsView()
            default:
                return null
        }
    }

    render(){
        return(
            <>
                <Header/>
                <div className='jobs-container-mobile'>
                    {this.renderJobsSearchBar()}
                    <UserProfile/>
                    {this.renderJobFiltersSection()}
                    {this.renderJobs()}
                </div>
                <div className='jobs-container-desktop'>
                    <div className='side-bar-container'>
                        <UserProfile/>
                        {this.renderJobFiltersSection()}
                    </div>
                    <div className='main-frame'>
                        {this.renderJobsSearchBar()}
                        {this.renderJobs()}
                    </div>
                </div>
            </>
        )
    }
}
export default JobsPage