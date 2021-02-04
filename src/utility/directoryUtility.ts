import fs from 'fs';

const initDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
};

export { initDirectory };
