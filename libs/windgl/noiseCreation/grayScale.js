import fs from "fs";
import { PNG } from "pngjs";

const data = JSON.parse(fs.readFileSync("./data/noisedWindSpeeds.json"));
let width = 4096,
  height = 4096;

// 创建一个空的 PNG 图像
const png = new PNG({
  width: width, // 设置图像的宽度
  height: height, // 设置图像的高度
});

// 将灰度数据映射到图像的像素中
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixelIndex = (y * width + x) * 4;
    const grayscaleValue = data[y * width + x];

    // 设置每个像素的灰度值
    png.data[pixelIndex] = grayscaleValue; // Red
    png.data[pixelIndex + 1] = grayscaleValue; // Green
    png.data[pixelIndex + 2] = grayscaleValue; // Blue
    png.data[pixelIndex + 3] = 255; // Alpha
  }
}

// 将 PNG 图像写入文件
png.pack().pipe(fs.createWriteStream("./grayscale.png"));
