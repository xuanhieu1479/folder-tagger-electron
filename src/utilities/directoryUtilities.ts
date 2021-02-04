import fs from 'fs';

const initDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
};

const fileExists = (filePath: string): boolean => fs.existsSync(filePath);
const writeToFile = (
  filePath: string,
  fileContent: string,
  insertFromTop = false
): void => {
  if (!insertFromTop) fs.appendFileSync(filePath, fileContent);

  if (insertFromTop) {
    if (!fs.existsSync(filePath)) fs.appendFileSync(filePath, fileContent);
    else {
      const existingContent = fs.readFileSync(filePath);
      fs.writeFileSync(filePath, fileContent + existingContent);
    }
  }
};

const getFolderName = (folderLocation: string): string => {
  return folderLocation.split('\\').pop() || 'Error Name';
};
const getFolderThumbnail = (folderLocation: string): string | undefined => {
  const defaultThumbnail = `${folderLocation}\\folder.jpg`;
  if (fs.existsSync(defaultThumbnail)) return defaultThumbnail;
  const thumbnailName = fs
    .readdirSync(folderLocation, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .find(file => new RegExp(/\.(jpg|jpeg|png)$/).test(file.name))?.name;
  return thumbnailName ? `${folderLocation}\\${thumbnailName}` : undefined;
};

export {
  initDirectory,
  fileExists,
  writeToFile,
  getFolderName,
  getFolderThumbnail
};
