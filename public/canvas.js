let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthEle = document.querySelector(".pencil-width");
let eraserWidthEle = document.querySelector(".eraser-width");
let download = document.getElementById("download");
let undo = document.getElementById("undo");
let redo = document.getElementById("redo");
let penColor = "red"
let eraserClor = "white"
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;
let undoRedoTracker = []; //Data
let track = 0;//represt which action  from trcaker array


let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = penWidth;
let mouseDown = false

//mousedown--->start new path ,mousemove---->path fill(graphics)

canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY,
    // })

    //send data to server
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit('beginPath', data)

})
canvas.addEventListener('mousemove', (e) => {

    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserClor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        // drawStroke({
        //     x: e.clientX,
        //     y: e.clientY,
        //     color: eraserFlag ? eraserClor : penColor,
        //     width: eraserFlag ? eraserWidth : penWidth
        // })
        socket.emit('drawStroke', data);
    }

})

canvas.addEventListener('mouseup', (e) => {
    mouseDown = false
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})
undo.addEventListener("click", (e) => {
    if (track > 0) {
        track--;
        let trackObj = {
            trackValue: track,
            undoRedoTracker: undoRedoTracker
        }

        socket.emit("undoRedo", trackObj);
        // undoRedoCanvas(trackObj);
    } else {
        console.log("no more undo")
    }

})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) {
        track++;
        let trackObj = {
            trackValue: track,
            undoRedoTracker: undoRedoTracker
        }
        //undoRedoCanvas(trackObj);
        socket.emit("undoRedo", trackObj);

    } else {
        console.log("no more redo")
    }

})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url
    img.onload = () => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }


}
function beginPath(stokeObj) {
    tool.beginPath();
    tool.moveTo(stokeObj.x, stokeObj.y);
}

function drawStroke(stokeObj) {
    tool.strokeStyle = stokeObj.color;
    tool.lineWidth = stokeObj.width;
    tool.lineTo(stokeObj.x, stokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElement) => {
    colorElement.addEventListener("click", (e) => {
        let color = colorElement.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;

    })
})

pencilWidthEle.addEventListener("change", (e) => {
    penWidth = pencilWidthEle.value;
    tool.lineWidth = penWidth;
})
eraserWidthEle.addEventListener("change", (e) => {
    eraserWidth = eraserWidthEle.value;
    tool.lineWidth = eraserWidth;
})
eraserTool.addEventListener("click", (e) => {
    console.log(eraserFlag)
    if (eraserFlag) {
        tool.strokeStyle = eraserClor;
        tool.lineWidth = eraserWidth;

    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL()
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg"
    a.click()

})
socket.on("beginPath", (data) => {
    debugger
    //data===>data from server
    beginPath(data);
});
socket.on('drawStroke', (data) => {
    debugger
    drawStroke(data)
})
socket.on("undoRedo", (trackObj) => {
    debugger
    undoRedoCanvas(trackObj);
})