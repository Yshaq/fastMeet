import React from "react";
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";

// icons
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const MeetPage = () => {
    let params = useParams();
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    // array of objects of the form {peerID: userID, peer: peer}
    const peersRef = useRef([]);
    const roomID = params.roomID;
    const [myStream, setMyStream] = useState()
    const [isVideo, setIsVideo] = useState(true)
    const [isAudio, setIsAudio] = useState(true)

    useEffect(() => {
        // socketRef.current = io("https://fastmeet-backend.herokuapp.com/");        
        // console.log('socket made', socketRef.current)

        navigator.mediaDevices.getUserMedia({ video: {width: { min: 480, ideal: 720, max: 1280 }, aspectRatio: 1.33333 }, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            setMyStream(stream);

            // // socket joins room
            // socketRef.current.emit("join room", roomID);
            // // socket recieves array of all users already in this room
            // socketRef.current.on("all users", users => {

            //     const peers = [];
            //     users.forEach(userID => {
            //         const peer = createPeer(userID, socketRef.current.id, stream);
            //         peersRef.current.push({
            //             peerID: userID,
            //             peer,
            //         })
            //         peers.push(peer);
            //     })
            //     setPeers(peers);
            // })

            // // a new user joins the room. we 
            // socketRef.current.on("user joined", payload => {
            //     const peer = addPeer(payload.signal, payload.callerID, stream);
            //     peersRef.current.push({
            //         peerID: payload.callerID,
            //         peer,
            //     })

            //     setPeers(users => [...users, peer]);
            // });

            // socketRef.current.on("receiving returned signal", payload => {
            //     const item = peersRef.current.find(p => p.peerID === payload.id);
            //     item.peer.signal(payload.signal);
            //     console.log("return signal set for ", item.peerID, "connection established!")
            // });
        })
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <video style={{width: "100%"}} ref={userVideo} autoPlay playsInline muted/>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color={isAudio?"success":"error"} onClick={()=>{setIsAudio(!isAudio)}}>{isAudio?<MicIcon/>:<MicOffIcon/>}</Button>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color={isVideo?"success":"error"} onClick={()=>{setIsVideo(!isVideo)}}>{isVideo?<VideocamIcon/>:<VideocamOffIcon/>}</Button>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color="error">HANG UP</Button>
                    </Grid>
                </Grid>
              </Item>
            </Grid>
        
          </Grid>
        </Box>
      );
}

export default MeetPage