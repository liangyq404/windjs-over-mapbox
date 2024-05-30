// const PNG = require("pngjs").PNG;

// const { umask } = require("process");

import { PNG } from "pngjs";
import fs from "fs";
import umask from "process";
import rgbHex from "rgb-hex";

// const data = JSON.parse(fs.readFileSync("tmp25.json"));
// const name = process.argv[2];
const name = "test";
// const uData = data.u.messages[0];
// const vData = data.v.messages[0];

// const uValues = uData.find((item) => item.key === "values").value;
// const vValues = vData.find((item) => item.key === "values").value;

// const uMax = uData.find((item) => item.key === "maximum").value;
// const uMin = uData.find((item) => item.key === "minimum").value;

// const vMax = vData.find((item) => item.key === "maximum").value;
// const vMin = vData.find((item) => item.key === "minimum").value;

// uMax, uMin, vMax, vMin
// 28.6884 -19.7116 20.2977 -21.4023

const newData = JSON.parse(fs.readFileSync("guangling2.json"));
const uData = newData[0].data;
const uMin = Math.min(...uData);
const uMax = Math.max(...uData);

const vData = newData[1].data;
const vMin = Math.min(...vData);
const vMax = Math.max(...vData);

console.log(uData.length, vData.length);

// console.log(uMax, uMin, vMax, vMin);
// 8.77 -0.85 8.77 -0.85

// const width = u.Ni;
// const height = u.Nj - 1;
// 以前出的图是 1440:720, 1440*721 = 1038240 即data中values的个数
// 现在要出的图是正方形的，30:30

// console.log(uValues, vValues);
// console.log(uMax, uMin, vMax, vMin);

const width = newData[0].header.nx; // 60
const height = newData[0].header.ny; // 30

console.log(width, height);

const png = new PNG({
  colorType: 2,
  filterType: 4,
  width: width,
  height: height,
});

// console.log(png.data.length);
// png.data.length = 60 * 30 * 4 = 7200, 4 -> RGBA channels

function hsvToRgb(h, s, v) {
  let r, g, b;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// convert to png
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixelIndex = (y * width + x) * 4;
    const k = y * width + x;

    // const redNorm = Math.floor((255 * (uData[k] - uMin)) / (uMax - uMin));
    // const greenNorm = Math.floor((255 * (vData[k] - vMin)) / (vMax - vMin));

    const redNorm = (255 * (uData[k] - uMin)) / (uMax - uMin);
    const greenNorm = (255 * (vData[k] - vMin)) / (vMax - vMin);

    const magnitude = Math.sqrt(redNorm ** 2 + greenNorm ** 2);
    const hue = magnitude * 0.36; // You can adjust this to fit your color scale

    const [r, g, b] = hsvToRgb(hue, 1, 1);

    console.log(hue);
    png.data[pixelIndex] = r; // R
    png.data[pixelIndex + 1] = g; // G
    png.data[pixelIndex + 2] = b; // B
    png.data[pixelIndex + 3] = 255; // A

    // png.data[pixelIndex] = Math.floor(
    //   (255 * (uData[k] - uMin)) / (uMax - uMin)
    // );
    // png.data[pixelIndex + 1] = Math.floor(
    //   (255 * (vData[k] - vMin)) / (vMax - vMin)
    // );

    // png.data[pixelIndex + 2] = 0; // B
    // png.data[pixelIndex + 3] = 255; // A
  }
}

// console.log(
//   Math.floor((255 * (uData[k] - uMin)) / (uMax - uMin)),
//   Math.floor((255 * (vData[k] - vMin)) / (vMax - vMin))
// );

// console.log(png.data);
// for (let y = 0; y < height; y++) {
//   for (let x = 0; x < width; x++) {
//     const i = (y * width + x) * 4;
//     const k = y * width + ((x + width / 2) % width);
//     png.data[i + 0] = Math.floor(
//       (255 * (u.values[k] - u.minimum)) / (u.maximum - u.minimum)
//     );
//     png.data[i + 1] = Math.floor(
//       (255 * (v.values[k] - v.minimum)) / (v.maximum - v.minimum)
//     );
//     png.data[i + 2] = 0;
//     png.data[i + 3] = 255;
//   }
// }

// console.log(rgbHex(65, 131, 196));

png.pack().pipe(fs.createWriteStream(name + ".png"));
fs.writeFileSync(
  name + ".json",
  JSON.stringify(
    {
      source: "envision greenwich",
      date: "today",
      width: width,
      height: height,
      uMin: uMin,
      uMax: uMax,
      vMin: vMin,
      vMax: vMax,
      // below added from windgl lib
      // minzoom: 0,
      // maxzoom: 2,
    },
    null,
    2
  ) + "\n"
);

// function formatDate(date, time) {
//   return (
//     date.substr(0, 4) +
//     "-" +
//     date.substr(4, 2) +
//     "-" +
//     date.substr(6, 2) +
//     "T" +
//     (time < 10 ? "0" + time : time) +
//     ":00Z"
//   );
// }
