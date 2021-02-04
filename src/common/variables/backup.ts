const BACKUP_DIRECTORY = 'Backup';

const failedDataName = `${new Date().getTime()}-FAILED.json`;
const failedDataPath = `${BACKUP_DIRECTORY}/${failedDataName}`;
const exportDataName = `${new Date().getTime()}-BACKUP.json`;
const exportDataPath = `${BACKUP_DIRECTORY}/${exportDataName}`;

const BACKUP = {
  DIRECTORY: BACKUP_DIRECTORY,
  NAME: failedDataName,
  PATH_FAILED_IMPORT: failedDataPath,
  PATH_EXPORT: exportDataPath
};

export default BACKUP;
