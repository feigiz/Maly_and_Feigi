import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './component/Signup';
import Login from './component/Login';
import Home from './component/Home';
import Header from './component/Header';
import Register from './component/Register';

function App() {
  // const [userDetails,setUserDetails]=useState({});
  const [nextId, setNextId] = useState(15)
  // ואם יש בדטה בייס יותר?
  return (
    <Router>
      <div className='App'>
        <Routes>
        {/* OUTLET ולהשתמש ב HEADER לעשות */}
          <Route path="/" element={<Header />} >
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup  nextId={nextId} setNextId={setNextId}/>} />
          </Route>
          <Route path="/home" element={<Home />} />
          {/* <Route path="/register" element={<Register userDetails={userDetails} nextId={nextId} setNextId={setNextId} />} /> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
