import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import './App.css'
import JobsPage from './components/JobsPage'
import JobDetailsPage from './components/JobDetailsPage'

const App = () => 
  <BrowserRouter>
    <Switch>
      <Route exact path='/login' component={LoginForm}/>
      <ProtectedRoute exact path='/' component={Home}/>
      <ProtectedRoute exact path='/jobs' component={JobsPage}/>
      <ProtectedRoute exact path='/jobs/:id' component={JobDetailsPage}/>
    </Switch>
  </BrowserRouter>

export default App
