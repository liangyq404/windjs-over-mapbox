import alea from "alea";
import { createNoise2D } from "simplex-noise";
import fs from "fs";
import { PNG } from "pngjs";
import jimp from "jimp";

// mark this:
// let seedE = 55524, // seed for wind speed
//   seedM = 323, // seed for height
//   seedN = 300; // seed for 2nd noise
// const frequencyE = 9, // for height
//   frequencyM = 4, // for wind speed
//   frequencyN = 10;

let seedE = 55524, // seed for wind speed
  seedM = 323, // seed for height
  seedN = 300; // seed for 2nd noise

const frequencyE = 9, // for height
  frequencyM = 4, // for wind speed
  frequencyN = 10;

let width = 900,
  height = 900;

let mappedHeights = [],
  mappedWindSpeeds = [];

let noise = [];

const heightData = JSON.parse(fs.readFileSync("./data/heightData.json"));
const windSpeedData = JSON.parse(fs.readFileSync("./data/windData.json"));

const normalize = (dataArray, range) => {
  let mappedValues = [];
  const minValue = Math.min(...dataArray);
  const maxValue = Math.max(...dataArray);
  dataArray.forEach((data) => {
    const mappedValue = ((data - minValue) / (maxValue - minValue)) * range;
    mappedValues.push(mappedValue);
  });
  return mappedValues;
};

windSpeedData.forEach((data) => {
  mappedWindSpeeds.push(normalize(data, 1));
});

heightData.forEach((data) => {
  mappedHeights.push(normalize(data, 1));
});

const genE = createNoise2D(alea(seedE));
const genM = createNoise2D(alea(seedM));
const genN = createNoise2D(alea(seedN));

function noiseE(nx, ny) {
  return genE(frequencyM * nx, frequencyM * ny) / 2 + 0.5;
}

function noiseM(nx, ny) {
  return genM(frequencyE * nx, frequencyE * ny) / 2 + 0.5;
}

function noiseN(nx, ny) {
  return genN(frequencyN * nx, frequencyN * ny) / 2 + 0.5;
}

const applyNoise = (dataWeight, ignore, dataArray) => {
  const noisedDataValues = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dataValue = dataArray[y][x];
      // console.log(dataValue);
      if (dataValue < ignore) {
        const nx = x / width - 0.5;
        const ny = y / height - 0.5;
        const e = 1.0 * noiseE(1 * nx, 1 * ny) + 0.8 * noiseE(2 * nx, 2 * ny);
        const m = 1.0 * noiseM(1 * nx, 1 * ny) + 0.75 * noiseM(2 * nx, 2 * ny);

        // 这种归一化方法使用了幂函数对值进行转换。它首先将原始值 e 除以一个常数（在这里是 1.0 + 0.5），然后将结果取 5 的幂。这种方法的特点是它对原始值的较小变化施加了更大的影响，因为幂函数具有快速增长的特性。这种归一化方法可能会导致某些值之间的差异被放大，从而更加突出地显示出数据的变化。
        // const eNormalized = Math.pow(e / (1.0 + 0.5), 5.0).toFixed(2); // toFixed(2) 仅保留小数点后两位
        // 这种归一化方法简单地将原始值 m 除以一个常数（在这里是 1.0 + 0.75）。它的作用是将原始值缩放到一个更小的范围内，使得数据更易于处理或可视化。这种方法通常用于确保数据在一定范围内，以便进行比较或其他操作。
        // const mNormalized = m / (1.0 + 0.75);
        // const mNormalized = m / (1.0 + 0.5);
        const eNormalized = e / (1.0 + 0.75);
        const mNormalized = m / (1.0 + 0.8);

        noise.push(mNormalized);
        // console.log(eNormalized);

        const noisedDataValue =
          dataValue * dataWeight + eNormalized * (1 - dataWeight);
        noisedDataValues.push(noisedDataValue);
      } else {
        noisedDataValues.push(1);
        noise.push(1);
      }
    }
  }
  return noisedDataValues;
};

const mixData = (weight, heightArray, windSpeedArray) => {
  const mixedValues = [];
  for (let i = 0; i < heightArray.length; i++) {
    const heightValue = heightArray[i];
    if (heightValue == 1) {
      mixedValues.push(1);
    } else {
      const mixedValue =
        heightArray[i] * weight + windSpeedArray[i] * (1 - weight);
      mixedValues.push(mixedValue);
    }
  }
  return mixedValues;
};

const noisedHeights = applyNoise(0.7, 0.98, mappedHeights);
const noisedWindSpeeds = applyNoise(0.2, 2, mappedWindSpeeds);

const mixedValues = mixData(0.5, noisedHeights, noisedWindSpeeds);
// const mixedValues2 = mixData(0.5, noise, mixedValues);

// console.log(noise);

// console.log(noise);

// // console.log(noisedHeights[0], noisedWindSpeeds[0]);
// console.log(mixedValues);

const createPNG = async (data, output) => {
  const png = new PNG({ width, height });

  // Map the data values to grayscale pixel values (0-255)
  for (let i = 0; i < data.length; i++) {
    const value = Math.round(data[i] * 255); // Map [0, 1] to [0, 255]
    const pixelIndex = i * 4; // Each pixel has 4 values (RGBA)

    // Set the same value for Red, Green, and Blue channels to create grayscale
    png.data[pixelIndex] = value; // Red channel
    png.data[pixelIndex + 1] = value; // Green channel
    png.data[pixelIndex + 2] = value; // Blue channel
    png.data[pixelIndex + 3] = 255; // Alpha channel (fully opaque)
  }

  // Create a writable stream and save the PNG image
  const outputStream = fs.createWriteStream(`./png/${output}.png`);
  png.pack().pipe(outputStream);

  outputStream.on("finish", () => {
    console.log("Grayscale image saved successfully.");
  });
};

const writeAsJson = (data, output) => {
  fs.writeFile(`./data/${output}.json`, JSON.stringify(data), (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`JSON file written.`);
    }
  });
};

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

const createHue = (data, output) => {
  const png = new PNG({ width, height });

  for (let i = 0; i < data.length; i++) {
    const hue = data[i] * 250;
    const pixelIndex = i * 4; // Each pixel has 4 values (RGBA)

    const [r, g, b] = hsvToRgb(hue, 1, 1);

    png.data[pixelIndex] = r; // R
    png.data[pixelIndex + 1] = g; // G
    png.data[pixelIndex + 2] = b; // B
    png.data[pixelIndex + 3] = 255; // A
  }

  // Create a writable stream and save the PNG image
  const outputStream = fs.createWriteStream(`./png/${output}.png`);
  png.pack().pipe(outputStream);

  outputStream.on("finish", () => {
    console.log("Grayscale image saved successfully.");
  });
};

async function blur(path) {
  const image = await jimp.read(path);
  image.blur(4).write("./png/blurred.png", (err) => console.log(err));
}

createPNG(noisedHeights, "noisedHeights");
createPNG(noisedWindSpeeds, "noisedWindSpeeds");
createPNG(mixedValues, "mixed");

// createPNG(noise, "noise");
// createPNG(mixedValues2, "mixedValues2");

setTimeout(() => {
  blur("./png/mixed.png");
}, 1000);

// createHue(mixedValues, "hue");

// writeAsJson(noisedHeights, "noisedHeights");
// writeAsJson(noisedWindSpeeds, "noisedWindSpeeds");
// writeAsJson(mixedValues, "mixed");
