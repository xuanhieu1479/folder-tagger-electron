const MESSAGE = {
  SUCCESS: 'Success',
  FOLDER_NOT_FOUND: 'This directory does not exist',
  FOLDER_ALREADY_EXISTS: 'This directory already exists in database',
  SPECIFIC_FOLDER_ALREADY_EXISTS: (folderlocation: string): string =>
    `${folderlocation}\nalready exists in database`,
  INVALID_PARAMS: 'The parameters are invalid'
};

export default MESSAGE;
