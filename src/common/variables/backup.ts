const BACKUP_DIRECTORY = 'Backup';

const failedDataName = `${new Date().getTime()}-FAILED.json`;
const failedDataPath = `${BACKUP_DIRECTORY}/${failedDataName}`;

const BACKUP = {
  DIRECTORY: BACKUP_DIRECTORY,
  NAME: failedDataName,
  PATH: failedDataPath
};

export default BACKUP;
