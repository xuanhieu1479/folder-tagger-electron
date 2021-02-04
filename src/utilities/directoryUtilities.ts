import fs from 'fs';

const initDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
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

export { initDirectory, getFolderName, getFolderThumbnail };
