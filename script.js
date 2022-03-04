const video = document.getElementById('video')

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


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  let rem = document.querySelector("canvas")
  
  var labeledFaceDescriptors
  (async () => {
    labeledFaceDescriptors = await loadLabeledImages()
  })()
  
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    
    if (detections.length > 1) {
      console.log("2 faces detected");
    }else{
      
      
      if (detections[0].alignedRect._score *100 > 80) {  //restricting the face at a certain percentage
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
              // console.log(result._label)
            }
            else{
              stopStreamedVideo(video);
              rem.remove()
              welcome(result._label);
            }
          })
        }
      }
    }
    
  }, 200)
})

function welcome(message){
  const welcomeMessage = 
  `Welcome ${message}`
  document.body.append(welcomeMessage)
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