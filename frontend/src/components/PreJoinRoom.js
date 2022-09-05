import React, {useState, useEffect, useRef, useContext} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import toast, { Toaster } from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography, Button, Container } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const PreJoinRoom = (props) => {
    const userObject = useContext(UserContext);
    let params = useParams();
    const navigate = useNavigate();
    const roomID = params.roomID;
    const userVideo = useRef();
    const [myStream, setMyStream] = useState();
    

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: {width: { min: 480, ideal: 720, max: 1280 }, aspectRatio: 1.33333 }, audio: true }).then(stream => {
          setMyStream(stream);
            userVideo.current.srcObject = stream;
        })
    }, []);
    console.log(window.location)
    const roomurl = `${window.location.host}/room/${roomID}`
  return (
    <>

      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
            <Typography variant="h5">
              {userObject.firstName?`Welcome ${userObject.firstName} ${userObject.lastName}!`:"You are not Logged in! Others can't see your name :("}
            </Typography>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
            <Typography variant="h5">You are about to join the room: {roomID}</Typography>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item><video style={{width: "50%"}} ref={userVideo} playsInline autoPlay muted/></Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Button style={{width: "50%"}} variant="contained" color="success" onClick={()=>{navigate(`/room/${roomID}`)}}>JOIN</Button>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Button style={{width: "50%"}} variant="contained" color="error" onClick={()=>{
                myStream.getTracks().forEach(function(track) {
                  track.stop();
                });
                navigate(`/`)
                }}>Go Back</Button>
            </Item>
          </Grid>
        </Grid>
        </Container>
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

  )
}

export default PreJoinRoom