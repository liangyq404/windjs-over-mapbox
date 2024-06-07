// using var to work around a WebKit bug
var canvas = document.getElementById("canvas"); // eslint-disable-line

const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const gl = canvas.getContext("webgl", { antialiasing: false });

const wind = (window.wind = new WindGL(gl));
wind.numParticles = 5000;

var capturer = new CCapture({
  format: "jpg",
  framerate: 60,
  quality: 100,
  //startTime: 5,
  timeLimit: 2,
  // autoSaveTime: 5,
  verbose: true,
});

function frame() {
  if (wind.windData) {
    wind.draw();
  }
  requestAnimationFrame(frame);
  capturer.capture(canvas);
}
frame();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "m") {
    console.log(event.key);
    capturer.start();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "n") {
    console.log(event.key);
    //default save, will download automatically a file called {name}.extension (webm/gif/tar)
    capturer.stop();
    capturer.save();
  }
});

const gui = new dat.GUI();
gui.add(wind, "numParticles", 1024, 589824);
gui.add(wind, "fadeOpacity", 0.96, 0.9999).step(0.0001).updateDisplay();
gui.add(wind, "speedFactor", 0.05, 1.0);
gui.add(wind, "dropRate", 0, 0.1);
gui.add(wind, "dropRateBump", 0, 0.2);

const windFiles = {
  0: "test",
  //   0: "2024041506",
  6: "2024041506",
  12: "2024041512",
  18: "2024041518",
  24: "2024041600",
  30: "2024041606",
  36: "2024041612",
  42: "2024041618",
  48: "2024041700",
};

const meta = {
  "2016-11-20+h": 0,
  "retina resolution": true,
  "github.com/mapbox/webgl-wind": function () {
    window.location = "https://github.com/mapbox/webgl-wind";
  },
};
gui.add(meta, "2016-11-20+h", 0, 48, 6).onFinishChange(updateWind);
if (pxRatio !== 1) {
  gui.add(meta, "retina resolution").onFinishChange(updateRetina);
}
gui.add(meta, "github.com/mapbox/webgl-wind");
updateWind(0);
updateRetina();

function updateRetina() {
  const ratio = meta["retina resolution"] ? pxRatio : 1;
  // const ratio = 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  wind.resize();
}

// getJSON(
//   "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_coastline.geojson",
//   function (data) {
//     const canvas = document.getElementById("coastline");
//     canvas.width = canvas.clientWidth * pxRatio;
//     canvas.height = canvas.clientHeight * pxRatio;

//     const ctx = canvas.getContext("2d");
//     ctx.lineWidth = pxRatio;
//     ctx.lineJoin = ctx.lineCap = "round";
//     ctx.strokeStyle = "white";
//     ctx.beginPath();

//     for (let i = 0; i < data.features.length; i++) {
//       const line = data.features[i].geometry.coordinates;
//       for (let j = 0; j < line.length; j++) {
//         ctx[j ? "lineTo" : "moveTo"](
//           ((line[j][0] + 180) * canvas.width) / 360,
//           ((-line[j][1] + 90) * canvas.height) / 180
//         );
//       }
//     }
//     ctx.stroke();
//   }
// );

function updateWind(name) {
  getJSON("wind/" + windFiles[name] + ".json", function (windData) {
    const windImage = new Image();
    windData.image = windImage;
    windImage.src = "wind/" + windFiles[name] + ".png";
    windImage.onload = function () {
      wind.setWind(windData);
    };
  });
}

function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("get", url, true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(xhr.response);
    } else {
      throw new Error(xhr.statusText);
    }
  };
  xhr.send();
}
