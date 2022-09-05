import React, { useState, useEffect, useContext } from "react";
import basestyle from "../Base.module.css";
import profilestyle from "./Profile.module.css";
import { useNavigate, NavLink } from "react-router-dom";
import GoogleButton from 'react-google-button'
import { Avatar } from '@mui/material'
import logo from '../../images/meeting_logo_2.jpg'
import { UserContext } from "../../context/UserContext";
import {  Button, List, ListItem, ListItemText } from "@mui/material";
// import { makeStyles } from "@mui/styles";


// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     flexDirection: "row",
//     padding: 0,
//   },
// }));

const Profile = () => {
  // const classes=useStyles()
  const userObject = useContext(UserContext)
  const navigate = useNavigate();

    return (
      <>
        <div className="nav_bar">
          <div className="left_nav_bar">
            <div className="logo">
              <img onClick={() => { navigate('/') }} src={logo} alt="meet online" />
            </div>
            <div className="logo_content">Meet Online</div>
          </div>
          <div className="account_section">
            <div>

                <List 
                className={basestyle.root}
                >
                  <ListItem>
                    <Avatar alt={userObject.firstName}/>
                  </ListItem>
                  <ListItem>
                    <Button
                      href="http://localhost:3000/auth/logout/"
                      variant="contained"
                      color="secondary"
                    >
                      {" "}
                      Logout
                    </Button>
                  </ListItem>
                </List>

            </div>
          </div>
        </div>
        
        <div className={basestyle.body}>

          <div className={profilestyle.login} >
            <Avatar
              style={{ margin: "auto", width: "200px", height: "200px" }}
              alt="Remy Sharp"
            />

            <h2>{userObject.firstName} {userObject.lastName}</h2>
            <h3>Email: {userObject.email}</h3>

          </div>
        </div>
      </>
    );
  };
  export default Profile;
