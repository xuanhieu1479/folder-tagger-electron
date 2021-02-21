import { remote } from 'electron';
import exec from 'child_process';
import _ from 'lodash';
import { AxiosError } from 'axios';
import { Position, Toaster, Intent } from '@blueprintjs/core';
import { SearchTagType } from '../common/interfaces/commonInterfaces';
import { MESSAGE, SEARCH } from '../common/variables/commonVariables';
import { fileExists } from './directoryUtilities';

const { app, BrowserWindow, shell } = remote;
const successTimeout = 1000;
const infoTimeout = 5000;
const errorTimeout = 2500;

const toaster = Toaster.create({
  position: Position.TOP
});
const showMessage = {
  info: (message: string): string =>
    toaster.show({ intent: Intent.PRIMARY, message, timeout: infoTimeout }),
  success: (message: string): string =>
    toaster.show({ intent: Intent.SUCCESS, message, timeout: successTimeout }),
  error: (error: Error | string): string => {
    let errorMessage = error.toString();
    if (typeof error === 'string') errorMessage = error;
    else if (error instanceof Error) {
      if ((error as AxiosError).isAxiosError) {
        const { response, request, message } = error as AxiosError;
        // Error returns from back end
        if (response) errorMessage = response.data.message;
        // Request was made, but no response returned
        else if (request) errorMessage = request.toString();
        // If worse comes to worst
        else errorMessage = message;
      } else errorMessage = error.message;
    }

    return toaster.show({
      intent: Intent.DANGER,
      message: errorMessage,
      timeout: errorTimeout
    });
  }
};

const getAppLocation = (): string => {
  return app.getAppPath();
};

const reload = (): void => {
  BrowserWindow.getFocusedWindow()?.reload();
};

const openDirectory = (directoryPath: string): void => {
  try {
    if (!fileExists(directoryPath))
      throw new Error(MESSAGE.DIRECTORY_DOES_NOT_EXIST(directoryPath));
    shell.openPath(directoryPath);
  } catch (error) {
    showMessage.error(error);
  }
};

const runExternalProgram = (
  externalProgrampath: string,
  passedArguments: string[]
): void => {
  try {
    const parsedArguments = passedArguments.map(argument => `${argument}\\`);
    exec.execFileSync(externalProgrampath, parsedArguments);
  } catch (error) {
    showMessage.error(error);
  }
};

const generateTagsFromSearchKeywords = (
  searchKeywords: string
): Partial<Record<SearchTagType, string[]>> => {
  const {
    COMMON_TERMS,
    END_OF_TAGS_CHARACTER,
    MINIMUM_LETTERS,
    TAG_KEYS
  } = SEARCH;
  const alternativeEndOfTagsRegex = `(${TAG_KEYS.map(
    (tagKey, index) => `${index > 0 ? '|' : ''}${tagKey}:`
  ).join('')})`;
  let searchQuery = searchKeywords;
  const tags: Partial<Record<SearchTagType, string[]>> = {};

  const sanitizeSearchKeywords = (
    searchQuery: string,
    miniMumLetters = MINIMUM_LETTERS
  ) => {
    const absoluteCharacterRegex = new RegExp(
      SEARCH.ABSOLUTE_TAGS_CHARACTER,
      'g'
    );
    // REFERENCE: https://stackoverflow.com/a/171499
    const absoluteTagRegex = new RegExp(
      `([${SEARCH.ABSOLUTE_TAGS_CHARACTER}])(?:(?=(\\\\?))\\2.)*?\\1`,
      'g'
    );

    const trimmedSearchQuery = searchQuery.trim().replace(/\s+/, ' ');
    const absoluteTags: string[] = [];
    const nonAbsoluteQuery = trimmedSearchQuery
      .replace(absoluteTagRegex, match => {
        absoluteTags.push(match);
        return '';
      })
      .replace(absoluteCharacterRegex, '')
      .trim();
    const nonAbsoluteTags = nonAbsoluteQuery.split(' ').filter(tag => {
      const isExcluded = tag[0] === SEARCH.EXCLUDE_TAGS_CHARACTER;
      const isAbsolute =
        tag[0] === SEARCH.ABSOLUTE_TAGS_CHARACTER &&
        _.last(tag) === SEARCH.ABSOLUTE_TAGS_CHARACTER;
      const isCommon = COMMON_TERMS.includes(tag);

      let isAboveMinimumLetters = tag.length >= miniMumLetters;
      if (isExcluded) isAboveMinimumLetters = tag.length >= miniMumLetters + 1;
      else if (isAbsolute)
        isAboveMinimumLetters = tag.length >= miniMumLetters + 2;

      return isAboveMinimumLetters && !isCommon;
    });

    return [...new Set([...absoluteTags, ...nonAbsoluteTags])];
  };

  const getTagsByTagKeyFromSearchKeywords = (tagKey: string) => {
    const tagKeyRegex = `${tagKey}:`;
    const searchRegex = new RegExp(
      `(?<=${tagKeyRegex})(.*?)(?=(\\${END_OF_TAGS_CHARACTER}|${alternativeEndOfTagsRegex}|$))`,
      'gi'
    );
    searchQuery = searchQuery
      .replace(searchRegex, match => {
        switch (tagKey) {
          case 'parody':
          case 'character':
            tags[tagKey] = sanitizeSearchKeywords(match, 2);
            break;
          case 'name':
          case 'author':
          case 'genre':
            tags[tagKey] = sanitizeSearchKeywords(match);
            break;
        }
        return '';
      })
      .replace(tagKeyRegex, '');
  };

  TAG_KEYS.forEach(tagKey => getTagsByTagKeyFromSearchKeywords(tagKey));
  const wildcardTags = sanitizeSearchKeywords(
    searchQuery.replace(END_OF_TAGS_CHARACTER, '')
  );
  if (!_.isEmpty(wildcardTags)) tags['wildcard'] = wildcardTags;
  return tags;
};

export {
  showMessage,
  getAppLocation,
  reload,
  openDirectory,
  runExternalProgram,
  generateTagsFromSearchKeywords
};
