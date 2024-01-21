import { useState, createContext } from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './component/Signup';
import Login from './component/Login';
import Home from './component/Home';
import Header from './component/Header';
import Albums from './component/Albums';
import Info from './component/Info';
import Posts from './component/Posts';
import Todos from './component/Todos';
import SinglePost from './component/SinglePost';
import Comments from './component/Comments';

export const AppContext = createContext();

function App() {
  // const [userDetails,setUserDetails]=useState({});
  // const [nextId, setNextId] = useState(15)
  // ואם יש בדטה בייס יותר?
  const [userDetailes, setUserDetails] = useState();

  return (
    <div className='App'>
      <AppContext.Provider value={{ userDetailes, setUserDetails }}>
        <Router>
          <Routes>
          {/* <Route path="comments" element={<Comments />} /> */}
            {/* OUTLET ולהשתמש ב HEADER לעשות */}
            <Route path="/" element={<Header />} >
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* nextId={nextId} setNextId={setNextId} */}
            </Route>
            <Route path="/home/users/:id" element={<Home />} >
              <Route path="info" element={<Info />} />
              <Route path="todos" element={<Todos />} />
              <Route path="posts" element={<Posts />} >
                {/* <Route path=":id" element={<SinglePost />}> */}
                  <Route path="comments" element={<Comments />} />
                {/* </Route> */}
              </Route>
              <Route path="albums" element={<Albums />} />
            </Route>
            {/* <Route path="/register" element={<Register userDetails={userDetails} nextId={nextId} setNextId={setNextId} />} /> */}
          </Routes>
        </Router>
      </AppContext.Provider>
    </div >
  )
}

export default App
