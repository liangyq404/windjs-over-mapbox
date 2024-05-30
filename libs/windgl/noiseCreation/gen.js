import sharp from "sharp";
import fs from "fs";

const dataStore = {
  heightData: null,
  windData: null,
};

const readAsArray = async (filePath, outputPath, key) => {
  sharp(filePath)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const { width, height, channels } = info;
      console.log(`Width: ${width}, Height: ${height}, Channels: ${channels}`);

      if (channels !== 1) {
        throw new Error("Image is not a grayscale image");
      }

      const dataArray = [];
      for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
          row.push(data[y * width + x]);
        }
        dataArray.push(row);
      }

      const jsonData = JSON.stringify(dataArray);
      dataStore[key] = jsonData;
      writeAsJson(outputPath, jsonData);
      return dataArray;
    })
    // .then(console.log(dataStore.windData))
    .catch((err) => {
      console.error("Error:", err);
    });
};

const writeAsJson = (outputPath, data) => {
  fs.writeFile(outputPath, data, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`Height data has been written to ${outputPath}`);
    }
  });
};

readAsArray("./wind.png", "./data/windData.json", "windData");
readAsArray("./height.png", "./data/heightData.json", "heightData");

// readAsArray("./png/scaled.png", "./data/scaled.json", "scaled");
