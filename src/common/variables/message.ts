import { BreakDownTagType } from '../interfaces/commonInterfaces';

const MESSAGE = {
  SUCCESS: 'Success',
  FOLDER_ALREADY_EXISTS: 'This directory already exists in database',
  SPECIFIC_FOLDER_ALREADY_EXISTS: (folderlocation: string): string =>
    `${folderlocation}\nalready exists in database`,
  DIRECTORY_DOES_NOT_EXIST: (directoryPath: string): string =>
    `${directoryPath}\ndoes not exist!`,
  EXTERNAL_PROGRAM_PATH_INCORRECT: 'External program path is incorrect!',
  EXTERNAL_PROGRAM_INVALID: 'Provided path is not a program!',
  INVALID_PARAMS: 'The parameters are invalid',
  CANNOT_EDIT_MANY_FOLDERS: 'Only one folder can be edited at a time!',
  CANNOT_COPY_TAG_MANY_FOLDERS: 'Cannot copy tags from multiple folders!',
  COPY_FOLDER_NAME_TO_CLIPBOARD: "Copied folder's name to clipboard!",
  COPY_FOLDER_TAGS_TO_CLIPBOARD: (tagTypes: BreakDownTagType[]): string => {
    let copiedTagTypes = '';
    tagTypes.forEach((tagType, index) => {
      if (index === 0) copiedTagTypes += tagType;
      else if (index === tagTypes.length - 1)
        copiedTagTypes += ` and ${tagType}`;
      else copiedTagTypes += `, ${tagType}`;
    });
    return `Copied folder's ${copiedTagTypes} to clipboard!`;
  },
  SPECIAL_CHARACTERS_FORBIDDEN: 'Special characters are not allowed!',
  CANNOT_CALCULATE_TAG_RELATIONS:
    'Not enough information to calculate tag relations'
};

export default MESSAGE;
