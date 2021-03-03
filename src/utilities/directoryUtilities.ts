import fs from 'fs';

const initDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
};

const fileExists = (filePath: string): boolean => fs.existsSync(filePath);
const writeToFile = (
  fileDirectory: string,
  filePath: string,
  fileContent: string,
  overWrite = true,
  insertFromTop = false
): void => {
  initDirectory(fileDirectory);
  if (!fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, fileContent);
    return;
  }
  if (overWrite) {
    fs.writeFileSync(filePath, fileContent);
    return;
  }
  if (insertFromTop) {
    const existingContent = fs.readFileSync(filePath);
    fs.writeFileSync(filePath, fileContent + existingContent);
    return;
  }

  fs.appendFileSync(filePath, fileContent);
};

const getFolderDirectory = (folderLocation: string): string => {
  const fragments = folderLocation.split('\\');
  fragments.pop();
  return fragments.join('\\');
};
const getFolderName = (folderLocation: string): string => {
  return folderLocation.split('\\').pop() || 'Error Name';
};
const getFolderExtension = (folderLocation: string): string => {
  return folderLocation.split('.').pop() || 'Error Extension';
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

const renameFolder = (oldPath: string, newPath: string): void => {
  fs.renameSync(oldPath, newPath);
};

export {
  initDirectory,
  fileExists,
  writeToFile,
  getFolderDirectory,
  getFolderName,
  getFolderExtension,
  getFolderThumbnail,
  renameFolder
};
