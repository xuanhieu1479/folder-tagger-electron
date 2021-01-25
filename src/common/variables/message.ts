const MESSAGE = {
  SUCCESS: 'Success',
  FOLDER_ALREADY_EXISTS: 'This directory already exists in database',
  SPECIFIC_FOLDER_ALREADY_EXISTS: (folderlocation: string): string =>
    `${folderlocation}\nalready exists in database`,
  INVALID_PARAMS: 'The parameters are invalid',
  CANNOT_EDIT_MANY_FOLDERS: 'Only one folder can be edited at a time!'
};

export default MESSAGE;
