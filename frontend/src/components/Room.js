import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Container, Typography } from "@mui/material";

// icons
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import toast, { Toaster } from 'react-hot-toast';


import { UserContext } from "../context/UserContext";


// const notify = () => toast.success('Here is your toast.');

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);    

    return (
        <Grid item xs={6} lg={3}>
              <Item>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Container maxWidth="md">
                            <Typography variant="h6">{props.pobj.peerName}</Typography>
                        </Container>
                    </Grid>
                    <Grid item xs={12}>
                    <video style={{width: "100%"}}  playsInline autoPlay ref={ref} />
                    </Grid>
                </Grid>
              </Item>
        </Grid>
    );
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const Room = (props) => {
    let params = useParams();
    const navigate = useNavigate();
    const userObject = useContext(UserContext);
    // peers associated with client
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    // array of objects of the form {peerID: userID, peer: peer, peerName: name}
    const peersRef = useRef([]);
    const roomID = params.roomID;
    const [myStream, setMyStream] = useState()
    const [isVideo, setIsVideo] = useState(true)
    const [isAudio, setIsAudio] = useState(true)
    let fullname = `${userObject.firstName} ${userObject.lastName}`


    useEffect(() => {
        // console.log(userObject)
        socketRef.current = io("http://localhost:3000/");        
        // console.log('socket made', socketRef.current)

        navigator.mediaDevices.getUserMedia({ video: {width: { min: 480, ideal: 720, max: 1280 }, aspectRatio: 1.33333 }, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            setMyStream(stream);

            // socket joins room
            socketRef.current.emit("join room", roomID, fullname);
            // socket recieves array of all users already in this room
            socketRef.current.on("all users", (users, usersToName) => {

                const temppeers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                        peerName: usersToName[userID]
                    })
                    temppeers.push(peer);
                })
                setPeers(temppeers);

            })

            // a new user joins the room. we 
            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                    peerName: payload.name
                })

                setPeers(users => [...users, peer]);

                // console.log("peersRef.current", peersRef.current);
                toast.success(`${payload.name} joined the meet!`);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
                // console.log("return signal set for ", item.peerID, "connection established!")
            });

            socketRef.current.on("someone disconnected", leftID => {
                // console.log("first peers", peers)
                // console.log(leftID, " has left");

                let leftpeer = peersRef.current.find(obj => obj.peerID==leftID)
                // console.log("left peer is ", leftpeer)
                toast.error(`${leftpeer.peerName} left the meet!`)

                setPeers(current => current.filter(p => p!=leftpeer.peer))

                let temp = peersRef.current
                temp = temp.filter(obj => obj.peerID!=leftID)
                peersRef.current = temp
                // console.log("peersRef.current", peersRef.current);

            })
        })
    }, []);

    // creates a new initiator peer, and sends signal to arg1 socket
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        // console.log("init peer", peer)
        peer.on("signal", signal => {
            // console.log("initator sending signal to ", userToSignal)
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, name: fullname })
        })


        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            console.log("signal recieved, returning signal")
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        console.log("incoming signal set for", callerID ,"now need to send return signal")
        peer.signal(incomingSignal);


        return peer;
    }

    // console.log(window.location.href);

    
    function toggleVideo() {
        myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled)
        setIsVideo(myStream.getVideoTracks()[0].enabled)
    }

    function toggleAudio() {
        myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled)
        setIsAudio(myStream.getAudioTracks()[0].enabled)
    }


    return (
        <>

        
        <Box sx={{ flexGrow: 1 }}>

          <Grid container spacing={2}>
            <Grid item xs={12}>
                <Item>
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <h3>Meeting ID: {roomID}</h3>
                        </Grid>
                        <Grid item sm={6}>
                            <h3>Share room link: {window.location.origin}/join/{roomID}</h3>
                        </Grid>
                        <Grid item sm={2}>
                            <Button variant="contained" color="secondary" onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/join/${roomID}`)}}>Click to Copy</Button>
                        </Grid>
                    </Grid>
                </Container>
                </Item>
            </Grid>
            <Grid item xs={6} lg={3}>
              <Item>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <Container maxWidth="md">
                        <Typography variant="h6">{userObject.firstName?`${userObject.firstName} ${userObject.lastName}`:'please login for name'}</Typography>
                    </Container>
                    </Grid>
                    <Grid item xs={12}>
                    <video style={{width: "100%"}} ref={userVideo} autoPlay playsInline muted/>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color={isAudio?"success":"error"} onClick={toggleAudio}>{isAudio?<MicIcon/>:<MicOffIcon/>}</Button>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color={isVideo?"success":"error"} onClick={toggleVideo}>{isVideo?<VideocamIcon/>:<VideocamOffIcon/>}</Button>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color="error" onClick={()=>{
                        socketRef.current.disconnect();
                        myStream.getTracks().forEach(function(track) {
                            track.stop();
                          });
                        navigate('/');
                        }}>HANG UP</Button>
                    </Grid>
                </Grid>
              </Item>
            </Grid>

            {peers.map((peer, index) => {
                let p = peersRef.current.find(obj => obj.peer == peer)
                // console.log("p when rendering", p);
                return (
                    <Video key={index} peer={peer} pobj={p} />
                );
            })}
        
          </Grid>
        </Box>
        <Toaster
        position="top-center"
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
};

export default Room;
