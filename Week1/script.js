const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let webCam = document.getElementById("webcamElement");
const referenceWidth = 640;
const referenceHeight = 320;
const pixelScale = window.devicePixelRatio;

let constraints = { audio: false, video: { width: 1280, height: 720 } };

let today = new Audio("./assets/today-cut.mp3");
let pictureMeBetter = new Audio("./assets/picture-cut.mp3");
let imy = new Audio("./assets/imy-cut.mp3");

let songs = [today, pictureMeBetter, imy];

//get access to the webcam
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    /* use the stream */
    webCam.srcObject = stream;
    webCam.onloadedmetadata = (e) => webCam.play();

    //add the change color function here?
    webCam.addEventListener("loadeddata", setup);
  })
  .catch(function (err) {
    /* handle the error */
    console.log(err);
  });

let currentFilter = defaultFilter;

function setup() {
  //display size
  canvas.style.width = referenceWidth + "px";
  canvas.style.height = referenceHeight + "px";

  // Set actual device pixels
  canvas.width = referenceWidth * pixelScale;
  canvas.height = referenceHeight * pixelScale;

  // normalize the coordinate system
  ctx.scale(pixelScale, pixelScale);
  document.getElementById("titanic").onmouseover = () => {
    currentFilter = blueArc;
    songs.forEach((e) => e.pause());
    pictureMeBetter.play();
  };
  document.getElementById("titanic").onmouseout = () =>
    (currentFilter = defaultFilter);
  document.getElementById("7g").onmouseover = () => {
    currentFilter = rainbowEllipse;
    songs.forEach((e) => e.pause());
    today.play();
  };
  document.getElementById("7g").onmouseout = () =>
    (currentFilter = defaultFilter);
  document.getElementById("minor").onmouseover = () => {
    currentFilter = grayRect;
    songs.forEach((e) => e.pause());
    imy.play();
  };
  document.getElementById("minor").onmouseout = () =>
    (currentFilter = defaultFilter);

  drawPixels();
}

function drawPixels() {
  const imgScale = 6.5;

  ctx.drawImage(
    webCam,
    0,
    0,
    640 / (imgScale * pixelScale),
    320 / (imgScale * pixelScale)
  );

  let imageData = ctx.getImageData(
    0,
    0,
    referenceWidth / imgScale,
    referenceHeight / imgScale
  );
  let data = imageData.data;
  //   console.log(data.length);

  ctx.clearRect(0, 0, referenceWidth, referenceHeight);

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      let index = (x + y * imageData.width) * 4; // index position of every pixel

      let r = data[index + 0]; // red
      let g = data[index + 1]; // green
      let b = data[index + 2]; // blue
      let a = data[index + 3]; // alpha

      ctx.save(); // optional
      ctx.translate(imgScale / 2, imgScale / 2); // optional
      ctx.beginPath();

      currentFilter(r, g, b, x, y, imgScale);

      ctx.fill();
      ctx.restore();
    }
  }

  requestAnimationFrame(drawPixels);
}

function defaultFilter(r, g, b, x, y, scale) {
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(x * scale, y * scale, scale, scale);
}

function grayRect(r, g, b, x, y, scale) {
  let gray = (r + g + b) / 3;
  ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
  ctx.fillRect(x * scale, y * scale, scale, scale);
}

function rainbowEllipse(r, g, b, x, y, scale) {
  let rColor = Math.round(Math.random() * 255);
  let bColor = Math.round(Math.random() * 255);
  let gColor = Math.round(Math.random() * 255);
  let gray = (r + g + b) / 3;
  ctx.fillStyle = `rgb(${r},${g},${b})`;

  if (gray <= 100) {
    ctx.fillStyle = `rgba(${rColor},${bColor},${gColor},0.5)`;
  }

  ctx.arc(x * scale, y * scale, scale / 2, 0, Math.PI * 2);
}

function getRandomRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function blueArc(r, g, b, x, y, scale) {
  let gray = (r + g + b) / 3;
  let h = getRandomRange(200, 240);
  let s = getRandomRange(50, 90);
  let l = getRandomRange(20, 75);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  if (gray <= 120) {
    ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
  }
  ctx.arc(x * scale, y * scale, scale / 2, 0, Math.PI * 2);
}
