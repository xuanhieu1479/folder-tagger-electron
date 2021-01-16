import fs from 'fs';

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

export { getFolderName, getFolderThumbnail };
