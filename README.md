# FastMeet
FastMeet - a peer to peer video calling web app using WebRTC

## Setup instructions:

1. Clone the repository  
`git clone https://github.com/cryptic-pr03/fastMeet.git`

2. Setup and run the backend  
`cd fastMeet`   
`npm install`  
`npm start`  
  
3. Setup and run the frontend  
`cd frontend`  
`npm install`  
`npm start`  
Note: Since backend is already running on port 3000, npm will ask you to run the frontend on another port. Allow this (type Y then enter). Your Frontend should now be running on http://localhost:3001/  

---

Note: Normal Login is broken. Please login with google to use the app as a logged-in user.


### Features Implemented:
1. Login with Google OAuth
2. Login and SignUp with email (broken)
3. Create Room
4. Join room with direct link, or by entering meeting-id
5. Turn On/Off Video
6. Turn On/Off Mic
7. Group Video Conferencing


### Tech Used:
1. WebRTC, simple-peer library
2. ReactJS for frontend
3. Node.js for backend and signalling server
4. MongoDB Atlas as a database

---

### Screenshots:

#### Home Page, Create Meet
![image](https://iili.io/6Mw87a.png)

#### Start Meet/Join Meet, Preview Page
![image](https://iili.io/6MwO11.png)

#### Join Meet using meeting ID
![image](https://iili.io/6MwUmv.png)

#### Video Conferencing with multiple clients in a room
![image](https://iili.io/6Mw4Xp.png)



