import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import LeaveForm from './components/LeaveForm'
import LeaveHistory from './components/LeaveHistory'
import AdminPanel from './components/AdminPanel'

function App() {

  return (
    <>
     <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/leaveform' element={<LeaveForm/>}/>
        <Route path='/leavehistory' element={<LeaveHistory/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
