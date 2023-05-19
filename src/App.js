import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Landing from './landing';
import List from './excerList';
import PracticeExercise from './practice';
import Chat from './components/Home/Chat';
import Aboutafterlogin from "./components/Home/Aboutafterlogin";
import BK from './nvBK';
import Forgot from './components/Login/Forgotps'
import { auth } from "./firebase";

import "./App.css";

function App( ) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      } else setUserName("");
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/" element={<Home name={userName} />} /> */}
          <Route path="/" element={ <Landing/> } />
          <Route path="excerList" element={<List/>}/>
          <Route path="practice" element={<PracticeExercise name={userName}/>}/>
          {/* <Route path="chat" element={<Chat/>}/> */}
          <Route path="chat" element={<Chat/>}/>
          <Route path="aboutus" element={<Aboutafterlogin/>}/>
          <Route path="BK" element={<BK/>}/>
          <Route path="forgot" element={<Forgot/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
