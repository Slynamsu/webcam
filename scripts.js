// Selecting necessary DOM elements
const canvas = document.querySelector(".photo");
const video = document.querySelector(".player");
const strip = document.querySelector(".strip");
const context = canvas.getContext("2d");
const snap = document.querySelector(".snap");
let animationId;
let mediaStream;

// Accessing user's camera and starting video stream
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
      mediaStream = localMediaStream;
    })
    .catch((err) => {
      console.error("Error accessing camera:", err);
    });
}

// Display video frames on the canvas
function displayOnCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  function draw() {
    context.drawImage(video, 0, 0, width, height);
    animationId = requestAnimationFrame(draw);
  }

  animationId = requestAnimationFrame(draw);
}

// Capture image from canvas and display in the strip
function snapImage() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "image.jpg");
  link.innerHTML = `<img src="${data}" alt="webcam image">`;
  strip.insertBefore(link, strip.firstChild);
}

// Start the video stream and display frames on canvas when video metadata is loaded
getVideo();
video.addEventListener("loadedmetadata", displayOnCanvas);

function stopCanvasAnimation() {
  cancelAnimationFrame(animationId);
}

// Function to stop the video stream
function stopVideoStream() {
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
  }
}

const takePhotoBtn = document.getElementById("takePhotoBtn");
takePhotoBtn.addEventListener("click", snapImage);

// Event listener to trigger stopping the video stream when the user navigates away
window.addEventListener("beforeunload", stopVideoStream);
