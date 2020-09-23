const port = process.env.PORT || 8000;
const express = require("express");
const { appendFile } = require("fs");
const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

const server = require("http")
  .createServer(app)
  .listen(port, () => {
    console.log(`Your app is listening on port ${port}`);
  });

const io = require("socket.io").listen(server);

io.sockets.on("connection", (socket) => {
  console.log(`We have a new client ${socket.id}`);

  socket.on("sendImage", (data) => {
    // console.log(`Received ${data}`);

    io.sockets.emit("sendImage", data);
  });
  socket.on("disconnect", () =>
    console.log(`Client has disconnected ${socket.id}`)
  );
});
