import "../src/css/App.css";
import React from "react";
import HomePage from "./components/HomePage";
import PreJoinRoom from "./components/PreJoinRoom";
import Room from "./components/Room";
import MeetPage from "./components/MeetPage";
import { useState } from 'react'
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register.js";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile/Profile.js";
function App() {
  const [userstate, setUserState] = useState({});
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route exact path="/join/:roomID" element={<PreJoinRoom />}></Route>
        <Route exact path="/room/:roomID" element={<Room />}></Route>
        <Route exact path="/meet" element={<MeetPage />}></Route>
        {/* <Route exact path="/meet" element={<HomePage />}></Route> */}
        <Route
          path="/login"
          element={<Login setUserState={setUserState} />}
        ></Route>
        <Route
          path="/signup"
          element={<Register />}
        ></Route>
        <Route
          path="/profile"
          element={<Profile />}
        ></Route>
        {/* <Route exact path="/login" element={<Login />}></Route> */}
        {/* <Route
          exact
          path="/meet/p/:roomToJoin"
          element={<VideoStreams roomId={id} />}
        ></Route> */}
      </Routes>
    </div>
  );
}

export default App;
