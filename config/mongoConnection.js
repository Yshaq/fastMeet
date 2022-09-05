
//mongo atlas connection
//------------------------------------------------------------------------------------------------------------------------
const mongoose = require("mongoose");
const connectionURI =
  "mongodb+srv://cryptic-pr03:nlQFBpNMAqRD4bUJ@cluster0.s1ohzau.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(connectionURI, {
    useNewUrlParser: true, //https://stackoverflow.com/questions/65158360/what-does-usenewurlparser-and-usercreateindex-in-mongoose-connect-do
    useUnifiedTopology: true, //the MongoDB driver sends a heartbeat every heartbeatFrequencyMS to check on the status of the connection.
    dbName: "fastMeet",
  })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log("Error in connection", err));
