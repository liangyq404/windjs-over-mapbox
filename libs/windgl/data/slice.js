const cut = [];
const zoom = 3;
const cutCount = 2 ** zoom;
const step = 90 / cutCount;
for (let i = 1; i <= cutCount - 1; i++) {
  //   console.log(i * 0.703125);

  cut.push(i * step);
}

console.log(zoom, cutCount, step);
console.log(cut);

var imageToSlices = require("image-to-slices");
var lineXArray = [11.25, 22.5, 33.75, 45, 56.25, 67.5, 78.75];
var lineYArray = [11.25, 22.5, 33.75, 45, 56.25, 67.5, 78.75];
var source = "../demo/wind/test.png";

imageToSlices.configure({
  clipperOptions: {
    canvas: require("canvas"),
  },
});
imageToSlices(
  source,
  cut,
  cut,
  {
    saveToDir: "./cut",
  },
  function () {
    console.log("Done slicing.");
  }
);


