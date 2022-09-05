const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});


const cookieParser = require("cookie-parser"); // needed by express-flash
//for parsing different requests types
//------------------------------------------------------------------------------------------------------------------------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

// const cors = require('cors');
// const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin, callback) => {
//     if(whitelist.includes(origin))
//       return callback(null, true)

//       callback(new Error('Not allowed by CORS'));
//   }
// }

// app.use(cors(corsOptions));



// connection to mongodb atlas
require("./config/mongoConnection");

//authentication and authorisation
//------------------------------------------------------------------------------------------------------------------------
const passport = require("passport");
require("./config/google");
require("./config/local");
require("./config/passport");
const flash = require("express-flash");
const session = require("express-session"); // needed by express-flash

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// socket for WebRTC signalling server
//------------------------------------------------------------------------------------------------------------------------

// users contains roomID as key and array of socket.ids as value
const users = {};
// contains socketID as key and it's roomID as value
const socketToRoom = {};
const usersToName = {};

io.on('connection', socket => {
  console.log("new connection incoming from", socket.id)
  socket.on("join room", (roomID, fullname) => {
      console.log("socket", socket.id, " joined room", roomID)

      // add socket to room if not > 8
      if (users[roomID]) {
          const length = users[roomID].length;
          if (length === 12) {
            console.log("sorry more than 8 users in room ", roomID)
              socket.emit("room full");
              return;
          }
          users[roomID].push(socket.id);
          usersToName[socket.id] = fullname
      } else {
          users[roomID] = [socket.id];
          usersToName[socket.id] = fullname
      }
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
      let roomUsersToName = {}
      for (user of usersInThisRoom) {
        roomUsersToName[user] = usersToName[user]
      }

      socket.emit("all users", usersInThisRoom, roomUsersToName);
  });

  socket.on("sending signal", payload => {
      io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, name: payload.name });
  });

  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('disconnect', () => {
      console.log(socket.id, " disconnected")
      const roomID = socketToRoom[socket.id];
      let usersinroom = []
      usersinroom = users[roomID];
      if (usersinroom) {
        usersinroom = usersinroom.filter(id => id !== socket.id);
          users[roomID] = usersinroom;
          delete socketToRoom[socket.id]

        delete usersToName[socket.id]
      }
      try {
        for(let user of usersinroom) {
          io.to(user).emit("someone disconnected", socket.id)  
        }
      }
      catch(err) {
        console.log(err);
      }
  });

});

// -------------------------------



// routes
//------------------------------------------------------------------------------------------------------------------------


app.get("/", (req, res) => {
  res.send('<a href="http://localhost:3000/auth/google"> Login </a>');
});

app.get("/getUser", (req, res) => {
  console.log("/getUser", req.user);
  res.send(req.user);
});

const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes')
const protectedRoutes = require("./routes/protectedRoutes");
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/p", protectedRoutes);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}...`);
});
