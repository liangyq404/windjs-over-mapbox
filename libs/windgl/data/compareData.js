const fs = require("fs");

const data = JSON.parse(fs.readFileSync("tmp25.json"));

// test with old data from gov
const uValuesArray = data.u.messages[0];
const vValuesArray = data.v.messages[0];

var uValues = uValuesArray.find((item) => item.key === "values").value;
var vValues = vValuesArray.find((item) => item.key === "values").value;

// new data from greenwich
const newData = JSON.parse(fs.readFileSync("oneday.json"));
const uData = newData[0].data;

console.log(uValues.length);
