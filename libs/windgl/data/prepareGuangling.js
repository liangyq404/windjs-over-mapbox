const PNG = require("pngjs").PNG;
const fs = require("fs");
const name = "guanglingtest";

const newData = JSON.parse(fs.readFileSync("guangling.json"));
// console.log(newData.result[0][0].data);

const uData = newData.result[0][0].data;
const uMin = Math.min(...uData);
const uMax = Math.max(...uData);

const vData = newData.result[0][1].data;
const vMin = Math.min(...vData);
const vMax = Math.max(...vData);

const width = newData.result[0][0].header.nx; // 45
const height = newData.result[0][0].header.ny; // 30

// const png = new PNG({
//   colorType: 2,
//   filterType: 4,
//   width: width,
//   height: height,
// });

// console.log(`png width: ${width}, png height: ${height}`);

// for (let y = 0; y < height; y++) {
//   for (let x = 0; x < width; x++) {
//     const pixelIndex = (y * 30 + x) * 4;
//     const k = y * width + x;
//     console.log(
//       Math.floor((255 * (uData[k] - uMin)) / (uMax - uMin)),
//       Math.floor((255 * (vData[k] - vMin)) / (vMax - vMin))
//     );

//     png.data[pixelIndex] = Math.floor(
//       (255 * (uData[k] - uMin)) / (uMax - uMin)
//     );
//     png.data[pixelIndex + 1] = Math.floor(
//       (255 * (vData[k] - vMin)) / (vMax - vMin)
//     );

//     png.data[pixelIndex + 2] = 0; // B
//     png.data[pixelIndex + 3] = 255; // A
//   }
// }

// png.pack().pipe(fs.createWriteStream(name + ".png"));

// fs.writeFileSync(
//   name + ".json",
//   JSON.stringify(
//     {
//       source: "envision greenwich",
//       date: "today",
//       width: width,
//       height: height,
//       uMin: uMin,
//       uMax: uMax,
//       vMin: vMin,
//       vMax: vMax,
//     },
//     null,
//     2
//   ) + "\n"
// );
