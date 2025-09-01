import './index.css'

const FailureView=(props)=>{
    const {tryAgain} = props
    return(
        <div className='failure-container'>
            <img src='https://assets.ccbp.in/frontend/react-js/failure-img.png' alt='failure view' className='failure-img'/>
            <h3 className='failure-heading'>Oops! Something Went Wrong</h3>
            <p className='failure-description'>We cannot seem to find the page you are looking for.</p>
            <button type='button' className='retry-failure-btn' onClick={tryAgain}>Retry</button>
        </div>
    )
}

export default FailureView