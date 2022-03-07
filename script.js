// OPTIONS /resource/foo
// Access-Control-Request-Method- GET
// Access-Control-Request-Headers- Content-Type, x-requested-with
// Origin: https://api.ciuvo.com/api/analyze?url=http%3A%2F%2F127.0.0.1%3A5500%2F&version=2.1.3&tag=threesixty&uuid=F19075BB-810F-47F4-9513-8140FE47EA82

// fetch('https://api.ciuvo.com/api/', {
//   method: 'GET',
//   headers: { 'Content-Type': 'application/json'}
// });



// const express = require('express');
// const request = require('request');

// const app = express();

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// app.get('/jokes/random', (req, res) => {
//   request(
//     { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
//     (error, response, body) => {
//       if (error || response.statusCode !== 200) {
//         return res.status(500).json({ type: 'error', message: err.message });
//       }

//       res.json(JSON.parse(body));
//     }
//   )
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`listening on ${PORT}`));


const video = document.getElementById('video')
const videoDiv = document.querySelector('.videoDiv')

const camDiv = document.querySelector('.camera')
const animeClass = document.querySelector('.animeClass')
const errorclass = document.querySelector('.errorClass')


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

// stop video
function stopStreamedVideo(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();
  
  tracks.forEach(function(track) {
    track.stop();
  });
  
  videoElem.srcObject = null;
}
//loading animation
function loadAnimation(){
  
  const loadingString = 
  `
  <style>

      .lds-spinner {
        margin: 5rem 50%;
        color: official;
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
      .lds-spinner div {
        transform-origin: 40px 40px;
        animation: lds-spinner 1.2s linear infinite;
      }
      .lds-spinner div:after {
        content: " ";
        display: block;
        position: absolute;
        top: 3px;
        left: 37px;
        width: 6px;
        height: 18px;
        border-radius: 20%;
        background: #fff;
      }
      .lds-spinner div:nth-child(1) {
        transform: rotate(0deg);
        animation-delay: -1.1s;
      }
      .lds-spinner div:nth-child(2) {
        transform: rotate(30deg);
        animation-delay: -1s;
      }
      .lds-spinner div:nth-child(3) {
        transform: rotate(60deg);
        animation-delay: -0.9s;
      }
      .lds-spinner div:nth-child(4) {
        transform: rotate(90deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(5) {
        transform: rotate(120deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(6) {
        transform: rotate(150deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(7) {
        transform: rotate(180deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(8) {
        transform: rotate(210deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(9) {
        transform: rotate(240deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(10) {
        transform: rotate(270deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(11) {
        transform: rotate(300deg);
        animation-delay: 0s;
      }
      .lds-spinner div:nth-child(12) {
        transform: rotate(330deg);
        animation-delay: 0s;
      }
      @keyframes lds-spinner {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      
      
    </style>

    <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  
  `

  animeClass.innerHTML = loadingString
}
//user not found animation
function errorAnimation(){
  const errorString = 
  `
    <style>
      .errorClass{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    <img src="images/oops.gif" alt="logo" with ="600" height="600">

  `

  errorclass.innerHTML = errorString
}

let numUnknown = 0

video.addEventListener('play', () => {

  
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  videoDiv.appendChild(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  let removeCanvas = document.querySelector("canvas")


  var labeledFaceDescriptors
  (async () => {
    video.style.visibility = 'hidden' //hide the video to make time for looping
    loadAnimation() // load animation to make time for looping
    labeledFaceDescriptors = await loadLabeledImages()
    animeClass.remove() //remove animation after looping is done
    video.style.visibility = 'visible' // display the video for authenticating after looping is done
    console.log("start")
    
    // video.play()
  })()

  
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    
    if (detections.length > 1) { // still going to work on this one
      console.log("2 faces detected");
    }else{
      
      
      //if (detections[0].alignedRect._score *100 > 80) {  //restricting the face at a certain percentage
        if (labeledFaceDescriptors) {
          const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.48)
          const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            // console.log(detections[0].alignedRect._score *100)
            
            drawBox.draw(canvas)
            
            if (result._label === "unknown") {
              console.log("no")
              numUnknown++ // count the number of unknown encounters
              if (numUnknown > 50) { //if the number of unknwon encounters is greater than 50 then execute this
                stopStreamedVideo(video);
                removeCanvas.remove() 
                videoDiv.remove()
                errorAnimation() // load error animation if encounters are greater than 50
              }

            }
            else{
              stopStreamedVideo(video);
              removeCanvas.remove()
              videoDiv.remove()
              welcome(result._label); //welcome note once authenticated
              timeFunction() // once authenticated call the time function to move on to the next page automatically 
            }
          })
        }
      //}
    }
    
  }, 200)
})

function welcome(message){  //welcome not html injection
  // message.substring(message.slice(0, -1))
  const welcomeMessage = 
  `
  <style>
    .authDiv p{
      text-align: center;
      font-weight: bold;
      font-size: 45px;
      color: lightgreen;
    }

    /*------------------------ Animation -----------------------*/
    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: #7ac142;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    
    .checkmark {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: #fff;
      stroke-miterlimit: 10;
      margin: 10% auto;
      box-shadow: inset 0px 0px 0px #7ac142;
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }
    
    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }
    
    @keyframes stroke {
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes scale {
      0%, 100% {
        transform: none;
      }
      50% {
        transform: scale3d(1.1, 1.1, 1);
      }
    }
    @keyframes fill {
      100% {
        box-shadow: inset 0px 0px 0px 30px #7ac142;
      }
    }
  </style>

    <div class="authDiv">
      <p>Welcome ${message.slice(0, -1)}</p>
    </div>
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
  `
  
  camDiv.innerHTML = welcomeMessage
}

function loadLabeledImages() {
  // const labels = ['Eight','Five','Four','Molefe','Nine','Renzo','Seven','Six','Ten','v1','v2','v3','v4','v5','v6','v7','v8','v9']
  // const labels = ['Renzo1','Renzo2','s1','s2','t1','t2','u1','u2','v1','v2','w1','w2','Molefe1','Molefe2','x1','x2','y1','y2','z1','z2']
  const labels = ['Renzo1','Renzo2','Molefe1','Molefe2']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      // for (let i = 1; i <= 2; i++) {
        // const img = await faceapi.fetchImage(`./appFactory/${label}/${i}.jpg`)
        const img = await faceapi.fetchImage(`./appFactory/${label}.jpg`)

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        
      // }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

function timeFunction() { // move to the next page after 3 seconds
  setTimeout(function(){
    window.location = 'statPage.html'; }, 3000);
 }