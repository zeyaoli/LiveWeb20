const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let painting = document.getElementById("drawing");
let paint_style = getComputedStyle(painting);
canvas.width = parseInt(paint_style.getPropertyValue("width"));
canvas.height = parseInt(paint_style.getPropertyValue("height"));

// canvas.width = 492;
// canvas.height = 230;

let mouse = { x: 0, y: 0 };

canvas.addEventListener(
  "mousemove",
  function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);

ctx.lineWidth = 3;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = "#00CC99";

canvas.addEventListener(
  "mousedown",
  (e) => {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);

    canvas.addEventListener("mousemove", onPaint, false);
  },
  false
);

canvas.addEventListener(
  "mouseup",
  () => {
    canvas.removeEventListener("mousemove", onPaint, false);
  },
  false
);

const onPaint = () => {
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
};

function canvasBg() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
}
canvasBg();

// function windowOpen(dataURL) {
//   let id = Math.floor(Math.random() * 100);
//   let myWindow = window.open(
//     "",
//     id,
//     `width=${canvas.width}, height=${canvas.height}`
//   );

//   myWindow.document.write(
//     `<img src=${dataURL} id="imgConverted" style="float: left; border: 2px solid" />`
//   );
// }

// Socket io

let socket = io.connect();

socket.on("connect", () => console.log(`Connected`));

socket.on("sendImage", (data) => {
  //   console.log(data);
  let container = document.getElementById("messages");
  container.innerHTML += insertDiv(data);
});

function insertDiv(data) {
  let divWidth = Math.floor(Math.random() * window.innerWidth);
  let divHeight = Math.floor(Math.random() * window.innerHeight);
  let zIndex = Math.floor(Math.random() * 10);
  let ranID =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return `
    <div class="message" id=${ranID} style="position: absolute; top: ${divHeight}px; left: ${divWidth}px; z-index:${zIndex}">
        <div class="title-bar">
            <div class="title-bar-text">New Message</div>
            <div class="title-bar-controls">
                <button aria-label="Close"></button>
            </div>
        </div>
        ${insertImg(data)}
    </div>
    
    `;
}

function insertImg(data) {
  return `
        <img src=${data} alt="image message"/>
    `;
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

let imgButton = document.getElementById("toImage");
imgButton.addEventListener("click", () => {
  let dataURL = canvas.toDataURL();
  socket.emit("sendImage", dataURL);
});

let clearButton = document.getElementById("clearCanvas");
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasBg();
});
