const fs = require("fs");
const path = require("path");

// Function to move files to new folders and rename them
function moveAndRenameFiles(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const filesPerGroup = 8;
    let groupIndex = 0;

    while (files.length > 0) {
      const groupFolderName = `${groupIndex}`;
      const groupFolderPath = path.join(folderPath, groupFolderName);

      if (!fs.existsSync(groupFolderPath)) {
        fs.mkdirSync(groupFolderPath);
      }

      const groupFiles = files.splice(0, filesPerGroup);

      groupFiles.forEach((file, index) => {
        const sourcePath = path.join(folderPath, file);
        const destFileName = `${index}${path.extname(file)}`;
        const destPath = path.join(groupFolderPath, destFileName);

        fs.renameSync(sourcePath, destPath);
      });

      groupIndex++;
    }

    console.log("Files grouped and renamed successfully.");
  });
}

moveAndRenameFiles("./cut");
