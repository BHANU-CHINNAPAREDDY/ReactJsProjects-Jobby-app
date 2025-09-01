import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    showErrorMsg: false,
    errorMsg: "",
  }

  onChangeUserInput = event=>{
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  submitFailure=(errorMsg)=>{
    this.setState(
        {
            showErrorMsg: true,
            errorMsg
        }
    )
  }

  submitSuccess=(jwtToken)=>{
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires:30})
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = "https://apis.ccbp.in/login"
    const options ={
        method: "POST",
        body: JSON.stringify(userDetails)
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true){
        this.submitSuccess(data.jwt_token)
    }
    else{
        this.submitFailure(data.error_msg)
    }
  }


  renderLoginForm = () => {
    const {username, password, showErrorMsg, errorMsg} = this.state
    return (
        <form onSubmit={this.onSubmitForm} className="login-form">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label htmlFor="username" className="form-label">username</label>
          <input type="text" id="username" name="username" value={username} placeholder="Username" onChange={this.onChangeUserInput} className="form-input"/>
          <label htmlFor="password" className="form-label">password</label>
          <input type="password" id="password" name="password" value={password} placeholder="Password" onChange={this.onChangeUserInput} className="form-input"/>
          <button type="submit" className="submit-btn">Login</button>
          {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
        </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined){
        return <Redirect to='/'/>
    }
    return (
        <div className="login-form-container">
            {this.renderLoginForm()}
        </div>
    )
  }
}

export default LoginForm
