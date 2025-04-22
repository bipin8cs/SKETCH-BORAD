const express = require("express");
const socket = require("socket.io");
const cors = require('cors');

const app = express();//initialized and server ready
app.use(cors()); // Enable for all routes
app.use(express.static("public"));//serve static files from public directory

let port = 5000;

let server = app.listen(port, () => {
    console.log("server started on port 500");
})
let io = socket(server);
io.on("connection", (socket) => {
    console.log("socket connection made", socket.id);
    socket.on("beginPath", (data) => {
        //transfer data to all clients
        io.socket.emit("beginPath", data);
    })
    socket.on("drawStoke", (data) => {
        //transfer data to all clients
        io.socket.emit("drawStoke", data);
    })
    socket.on("undoRedo", (data) => {
        //transfer data to all clients
        io.socket.emit("undoRedo", data);
    })
})