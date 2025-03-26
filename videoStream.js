navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        document.getElementById('video1').srcObject = stream;
        document.getElementById('video2').srcObject = stream;
    })
    .catch(function(error) {
        console.error('Fehler beim Zugriff auf die Kamera:', error);
    }
);

// Funktion, um einen Aufruf an das jeweilige FastAPI Endpoint zu machen
async function callDetection(modelId) {
    const video = document.getElementById("video" + modelId);
    
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Konvertiere das Canvas in einen Blob (JPEG-Format)
    canvas.toBlob(async function(blob) {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");
  
      const url = "http://127.0.0.1:8000/detect/model" + modelId;
  
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData
        });
        const data = await response.json();
        // Wenn das Modell ein Lächeln erkennt, wird der Zeitstempel angezeigt
        if (data.smile_detected) {
          document.getElementById("timestamp" + modelId).textContent = "Laughed at " + data.timestamp;
        }
      } catch (err) {
        console.error("Fehler beim Aufruf des Detection-Endpunkts für Model " + modelId, err);
      }
    }, "image/jpeg");
  }
  

// Beispielhafte Simulation: Aufrufe an beide Endpoints alle 3 Sekunden
setInterval(() => {
    callDetection(1);
    callDetection(2);
}, 3000);