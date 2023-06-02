const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const img = document.getElementById("vbackground");

function onResults(results) {
  // Save the context's blank state
  canvasCtx.save();

  // Draw the raw frame
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  // Make all pixels not in the segmentation mask transparent
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

  // Blur the context for all subsequent draws then set the raw image as the background
  canvasCtx.globalCompositeOperation = 'destination-over';
  canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);


  document.getElementById('download').addEventListener('click', function(e) {
    let canvasUrl = canvasElement.toDataURL("image/jpeg", 0.5);
    console.log(canvasUrl);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "download-this-canvas";
    createEl.click();
    createEl.remove();
  });
  // Restore the context's blank state
  canvasCtx.restore();
}

const selfieSegmentation = new SelfieSegmentation({ locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
}});
selfieSegmentation.setOptions({
  modelSelection: 1,
});
selfieSegmentation.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await selfieSegmentation.send({ image: videoElement });
  },
  width: 640,
  height: 480
});
camera.start();

function downloadImage() {
    const canvas = document.getElementsByClassName('output_canvas')[0];
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'virtual_background_image.png';
    link.href = image;
    link.click();
  }
  
  
// Add a button or a link to trigger the image download
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Download Image';
downloadButton.addEventListener('click', downloadImage);
document.body.appendChild(downloadButton);
