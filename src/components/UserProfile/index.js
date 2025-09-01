import { Component } from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants ={
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

class UserProfile extends Component{
    state={
        apiStatus: apiStatusConstants.initial,
        userDetails: {}
    }

    componentDidMount(){
        this.getUserProfile()
    }

    getUserProfile= async () =>{

        this.setState({
            apiStatus: apiStatusConstants.inProgress
        })

        const jwtToken = Cookies.get('jwt_token')
        const apiUrl = "https://apis.ccbp.in/profile"
        const options ={
            method: "GET", 
            headers: {
                Authorization : `Bearer ${jwtToken}`
            }
        }
        try{
            const response = await fetch(apiUrl, options)
            const data = await response.json()
            if(response.ok === true){
                const profileDetails = data.profile_details
                const updatedData = {
                    name: profileDetails.name,
                    profileImageUrl : profileDetails.profile_image_url,
                    shortBio: profileDetails.short_bio
                }
                this.setState({
                    apiStatus: apiStatusConstants.success,
                    userDetails: updatedData
                })
            }
            else{
                this.setState({
                    apiStatus: apiStatusConstants.failure
                })
            }
        
        }
        catch(error){
            this.setState({
                apiStatus: apiStatusConstants.failure
            })
        }
    }

    onRetry = ()=>{
        this.getUserProfile()
    }

    renderLoadingView =()=>(
        <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
    )

    renderFailureView =()=>(
        <div className='failure-view-container'>
            <button type='button' onClick={this.onRetry} className='retry-btn'>
                Retry
            </button>
        </div>
    )

    renderProfileDetails =()=>{
        const {userDetails} = this.state
        const {name, profileImageUrl, shortBio} = userDetails
        return(
            <div className='profile-details-container'>
                <div className='profile-img-container'>
                    <img src={profileImageUrl} alt={name} className='profile-img'/>
                </div>
                <h1 className='profile-name'>{name}</h1>
                <p className='profile-bio'>{shortBio}</p>
            </div>
        )
    }

    renderView = ()=>{
        const {apiStatus} = this.state
        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return this.renderLoadingView()
            case apiStatusConstants.failure:
                return this.renderFailureView()
            case apiStatusConstants.success:
                return this.renderProfileDetails()
            default:
                return null
        }
    }

    render(){
        return(
            <div className='profile-container'>
                {this.renderView()}
            </div>
        )
    }
}
export default UserProfile