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
import Photos from './component/Photos';

export const AppContext = createContext();

function App() {
  const [userDetails, setUserDetails] = useState();

  return (
    <div className='App'>
      <AppContext.Provider value={{ userDetails, setUserDetails }}>
        <Router>
          <Routes>
            <Route path="/" element={<Header />} >
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route path="/home/users/:id" element={<Home />} >
              <Route path="info" element={<Info />} />
              <Route path="todos" element={<Todos />} />
              <Route path="posts">
                <Route index element={<Posts />} />
                <Route path=":id" element={<SinglePost />}>
                  <Route path="comments" element={<Comments />} />
                </Route>
              </Route>
              <Route path="albums" >
                <Route index element={<Albums />} />
                <Route path=":id">
                  <Route path="photos" element={<Photos />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppContext.Provider>
    </div >
  )
}

export default App
