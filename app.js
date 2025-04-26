const express = require("express");
const socket = require("socket.io");
const cors = require('cors');
const app = express();//initialized and server ready
app.use(cors(
    {
        origin: "*", // or specific domain like "http://localhost:3000"
        methods: ["GET", "POST"],
        transports: ["websocket"]
    }
)); // Enable for all routes
app.use(express.static("public"));//serve static files from public directory

let port = 1200;

let server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
let io = socket(server);
try {
    io.on("connection", (socket) => {
        console.log("socket connection made", socket.id);
        socket.on("beginPath", (data) => {
            //transfer data to all clients
            io.sockets.emit("beginPath", data);
        })
        socket.on("drawStroke", (data) => {
            //transfer data to all clients
            io.sockets.emit("drawStroke", data);
        })
        socket.on("undoRedo", (data) => {
            //transfer data to all clients
            io.sockets.emit("undoRedo", data);
        })
    })
} catch (error) {
    console.log(error);
}
