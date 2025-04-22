
let toolCont = document.querySelector(".tools-cont");
let optionsCont = document.querySelector(".options-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencilTool = document.getElementById("pencil");
let eraserTool = document.getElementById("eraser");
let stickyTool = document.getElementById("sticky");
let uploadCont = document.getElementById("upload");

let optionFlag = true
let pencilFlag = false
let eraserFlag = false

optionsCont.addEventListener("click", function (e) {
    optionFlag = !optionFlag;
    if (optionFlag) {
        openTools();
    } else {
        closeTools();
    }
    function openTools() {
        let iconElement = optionsCont.children[0];
        iconElement.classList.remove("fa-times");
        iconElement.classList.add("fa-bars");
        toolCont.style.display = "flex";
    }
    function closeTools() {
        let iconElement = optionsCont.children[0];
        iconElement.classList.remove("fa-bars");
        iconElement.classList.add("fa-times");
        toolCont.style.display = "none";
        pencilToolCont.style.display = "none";
        eraserToolCont.style.display = "none";
    }

})
pencilTool.addEventListener("click", function (e) {
    pencilFlag = !pencilFlag;
    if (pencilFlag) pencilToolCont.style.display = "block";
    else pencilToolCont.style.display = "none"
})
eraserTool.addEventListener("click", function (e) {
    eraserFlag = !eraserFlag;
    if (eraserFlag) eraserToolCont.style.display = "block";
    else eraserToolCont.style.display = "none"
})

stickyTool.addEventListener('click', (e) => {

    const stickyTemplateHTML = ` 
     <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck=false></textarea>
        </div>
        `;
    createSticky(stickyTemplateHTML)


})
uploadCont.addEventListener('click', (e) => {
    //open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    //input listener
    input.addEventListener('change', (e) => {
        let url = URL.createObjectURL(input.files[0])
        let stickyTemplate = ` 
    <div class="header-cont">
           <div class="minimize"></div>
           <div class="remove"></div>
       </div>
       <div class="note-cont">
           <img src="${url}"/>
       </div>
       `;
        createSticky(stickyTemplate)
    });


})
function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener('click', (e) => {
        stickyCont.remove()
    })
    minimize.addEventListener('click', (e) => {
        let noteCont = stickyCont.querySelector('.note-cont');
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none"
    })
}
const dragAndDrop = (ball, event) => {
    let shiftX = event.clientX - ball.getBoundingClientRect().left;
    let shiftY = event.clientY - ball.getBoundingClientRect().top;

    ball.style.position = 'absolute';
    ball.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    ball.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
    };
}

function createSticky(stickyTemplate) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", 'sticky-cont');
    stickyCont.innerHTML = stickyTemplate;
    document.body.appendChild(stickyCont);
    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);
    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event)
    }
    stickyCont.ondragstart = function () {
        return false
    }

}