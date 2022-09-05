import React, { useState, useEffect, useContext } from "react";
// import { useSelector } from "react-redux";
import { UserContext } from "../context/UserContext";
import basestyle from "./Base.module.css";
import logo from "../images/meeting_logo_2.jpg";
import { VideoCallOutlined, Keyboard } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

import meet_image from "../images/main.avif";

import { Avatar,Button,List,ListItem,ListItemText } from '@mui/material';


function HomePage() {
  const userObject = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (userObject.firstName) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [userObject]);

  const navigate = useNavigate();

  function createRoom() {
    const id = uuidv4();
    navigate(`/join/${id}`);
}

  const [roomToJoin, setRoomToJoin] = useState("");
  const [alert, setAlert] = useState("");
  const checkUserAuth = () => {
    !isAuthenticated ? setAlert("Login First") : createRoom();
  };
  return (
    <>
      <div className="nav_bar">
        <div className="left_nav_bar">
          <div className="logo">
            <img onClick={() => { navigate('/') }} src={logo} alt="meet onine" />
          </div>
          <div className="logo_content">FastMeet</div>
        </div>
        <div className="account_section">
          <div>
            {!isAuthenticated ? (
              <Button
              onClick={() => { navigate('/login') }}
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            ) : (
              <List 
              className={basestyle.root}
              >
                <ListItem>
                  <Avatar onClick={() => { navigate('/profile') }}   >{userObject.firstName[0]}</Avatar>
                </ListItem>
                <ListItem>
                  <Button
                    href="https://fastmeet-backend.herokuapp.com/auth/logout/"

                    variant="contained"
                    color="secondary"
                  >
                    {" "}
                    Logout
                  </Button>
                </ListItem>
              </List>
            )}
          </div>
        </div>
      </div>
      <div className="home_section">
        {isAuthenticated ? (
          <div className="left_section">
            <div className="main_heading">
              Peer to Peer video conferencing for everyone!
            </div>
            <div className="main_paragraph">
              <p>Connect with each other across the globe and celebrate with us</p>
            </div>
            <div className="main_buttons">
              <button
                id="start_meeting_button"
                className="main_button"
                onClick={checkUserAuth}
              >
                <span>
                  <VideoCallOutlined />
                </span>
                Start Meet
              </button>
              <button id="join_meeting_button" className="main_button">
                <span>
                  <Keyboard />
                </span>
                <TextField
                  onChange={(e) => {
                    setRoomToJoin(e.target.value);
                  }}
                  value={roomToJoin}
                  placeholder="meeting ID"
                />
              </button>
              {/* <a
                href={`/join/${roomToJoin}`}
                id="join_button"
                className="main_button"
              >
                Join
              </a> */}

              <Button onClick={()=>{
                if(roomToJoin=='') {
                  toast.error('You need to enter a meeting id!')
                }
                else if(roomToJoin.startsWith('http:')||roomToJoin.startsWith('https:')) {
                  window.location.replace(`${roomToJoin}`)
                }
                else {
                  navigate(`/join/${roomToJoin}`)
                }
              }}>Join</Button>
            </div>
          </div>
        ) : (
          <div className="left_section">
            <div className="main_heading">Login to use FastMeet</div>
            <div className="main_paragraph">
              <p>You must first login using google account to call someone</p>
            </div>
          </div>
        )}
        <div className="right_section">
          <div className="main_image">
            <img style={{width: '700px', height: '500px'}} src={meet_image} alt="" />
          </div>
          <div className="image_content">
            <div className="image_heading main_heading">
              Get a link to share
            </div>
            <div className="image_paragraph">
              Enjoy meeting online with friends, just share your meeting link!
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            style: {
            background: '#363636',
            color: '#fff',
            },

            // Default options for specific types
            success: {
            duration: 3000,
            theme: {
                primary: 'green',
                secondary: 'black',
            },
            },
        }}
        />
    </>
  );
}

export default HomePage;
