import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import _ from 'lodash';
import {
  Tag,
  BreakDownTagType
} from '../../../common/interfaces/commonInterfaces';
import { RootState } from '../../../common/interfaces/feInterfaces';
import {
  MESSAGE,
  ELEMENT_ID,
  SEED_DATA
} from '../../../common/variables/commonVariables';
import { TagAction } from '../../../common/enums/commonEnums';
import { CustomSuggest, CustomMultiSelect } from '../commonComponents';
import { showMessage } from '../../../utilities/feUtilities';
import {
  getTags,
  modifyTagsOfFolders,
  clearClipboard
} from '../../redux/tag/tagAction';

interface DialogContent {
  dialogType: TagAction;
  onClose: () => void;
}
const defaultSelectedTags: Record<BreakDownTagType, string[]> = {
  author: [],
  parody: [],
  character: [],
  genre: []
};
const defaultSuggestion = '';
const noneSuggestion = 'none';

const DialogContent = ({
  dialogType,
  onClose
}: DialogContent): ReactElement => {
  const dispatch = useDispatch();
  const { categories, languages, selectedFolders } = useSelector(
    (state: RootState) => state.folder
  );
  const { relations, clipboard } = useSelector((state: RootState) => state.tag);
  const { defaultValue } = useSelector((state: RootState) => state.setting);
  const { parody_character, author_parody, author_genre } = relations;
  const { allTags } = useSelector((state: RootState) => state.tag);
  const [tagSuggestions, setTagSuggestions] = useState({
    ...defaultSelectedTags
  });
  const [selectedCategory, setSelectedCategory] = useState(defaultSuggestion);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultSuggestion);
  const [selectedTags, setSelectedTags] = useState({ ...defaultSelectedTags });
  const [isFirstRender, setFirstRender] = useState(true);
  const [hasChange, setHasChange] = useState(false);
  const previousSelectedTags = useRef(selectedTags);
  const selectedCategoryRef = useRef(selectedCategory);
  const selectedLanguageRef = useRef(selectedLanguage);

  useEffect(() => {
    const getSelectedFolderTags = async () => {
      const selectedFolder = _.last(selectedFolders);
      const selectedFolderInfo = await getTags(dispatch, selectedFolder);
      if (typeof selectedFolderInfo === 'object') {
        const {
          category,
          language,
          tags: selectedFolderTags
        } = selectedFolderInfo;
        const selectedFolderCategory = category || defaultSuggestion;
        const selectedFolderLanguage = language || defaultSuggestion;

        switch (dialogType) {
          case TagAction.Add:
            if (selectedFolderCategory === defaultSuggestion) {
              setSelectedCategory(defaultValue.placeholderCategory);
            } else {
              setSelectedCategory(selectedFolderCategory);
            }
            if (selectedFolderLanguage === defaultSuggestion) {
              setSelectedLanguage(defaultValue.placeholderLanguage);
            } else {
              setSelectedLanguage(selectedFolderLanguage);
            }
            break;
          case TagAction.Edit: {
            const brokenDownTags = breakDownTags(selectedFolderTags);
            setSelectedTags(brokenDownTags);
            setSelectedCategory(selectedFolderCategory);
            setSelectedLanguage(selectedFolderLanguage);
            break;
          }
          default:
            break;
        }
      }
    };
    const pasteTags = () => {
      const brokenDownTags = breakDownTags(clipboard);
      const newSelectedTags = _.reduce(
        selectedTags,
        (accumulator: Record<BreakDownTagType, string[]>, tags, tagKey) => {
          switch (tagKey) {
            case 'author':
            case 'parody':
            case 'character':
            case 'genre':
              accumulator[tagKey] = [
                ...new Set([...tags, ...brokenDownTags[tagKey]])
              ];
              break;
          }
          return accumulator;
        },
        { author: [], parody: [], character: [], genre: [] }
      );
      setSelectedTags(newSelectedTags);
      dispatch(clearClipboard());
    };
    const keyDownListerner = (event: KeyboardEvent) => {
      const { key } = event;
      const { activeElement } = document;
      const isHoldingCtrl = event.ctrlKey;
      const isHoldingShift = event.shiftKey;
      const noInputIsBeingFocused = !activeElement?.id.includes(
        ELEMENT_ID.FOLDER_DIALOG_INPUT_PREFIX
      );

      switch (key) {
        case 'v':
          if (!isHoldingCtrl) return;
          pasteTags();
          break;
        case 'Enter':
          if (!isHoldingShift) return;
          onSave();
          break;
        case 'j':
          if (!noInputIsBeingFocused) return;
          setSelectedLanguage(SEED_DATA.LANGUAGE.japanese);
          break;
        case 'e':
          if (!noInputIsBeingFocused) return;
          setSelectedLanguage(SEED_DATA.LANGUAGE.english);
          break;
      }
      if (!isNaN(parseInt(key)) && noInputIsBeingFocused) {
        document.getElementById(ELEMENT_ID.FOLDER_DIALOG_INPUT(key))?.focus();
        event.preventDefault();
      }
    };

    if (dialogType !== TagAction.Remove) {
      getSelectedFolderTags();
    }

    setFirstRender(false);
    window.addEventListener('keydown', keyDownListerner);
    return () => window.removeEventListener('keydown', keyDownListerner);
  }, []);

  useEffect(() => {
    if (!_.isEmpty(allTags)) setTagSuggestions(breakDownTags(allTags));
  }, [allTags]);

  // On change character
  useEffect(() => {
    if (
      isFirstRender ||
      !hasChange ||
      _.isEmpty(parody_character) ||
      !_.isEmpty(selectedTags.parody)
    ) {
      previousSelectedTags.current.character = selectedTags.character;
      return;
    }
    const isOK = checkNewlySelectedTag(selectedTags.character, 'character');
    if (isOK) {
      const newCharacter = _.last(selectedTags.character) as string;
      const parodyOfThisCharacter = _.findKey(parody_character, characters =>
        characters.includes(newCharacter)
      );
      if (parodyOfThisCharacter) {
        setSelectedTags({
          ...selectedTags,
          parody: [parodyOfThisCharacter]
        });
      }
    }
    previousSelectedTags.current.character = selectedTags.character;
  }, [selectedTags.character]);
  // On change parody
  useEffect(() => {
    if (isFirstRender || !hasChange) {
      previousSelectedTags.current.parody = selectedTags.parody;
      return;
    }
    const isOK = checkNewlySelectedTag(selectedTags.parody, 'parody');
    if (isOK) {
      const newParody = _.last(selectedTags.parody) as string;
      if (!_.isEmpty(parody_character) && parody_character[newParody]) {
        const charactersOfThisParody = [...parody_character[newParody]];
        bringCertainTagSuggestionsToFront('character', charactersOfThisParody);
      }
      if (!_.isEmpty(author_parody)) {
        const authorsHaveThisParody = _.reduce(
          author_parody,
          (accumulator: string[], parodies, author) => {
            if (parodies.includes(newParody)) accumulator.push(author);
            return accumulator;
          },
          []
        );
        bringCertainTagSuggestionsToFront('author', authorsHaveThisParody);
      }
    }
    previousSelectedTags.current.parody = selectedTags.parody;
  }, [selectedTags.parody]);
  // On change author
  useEffect(() => {
    if (isFirstRender || !hasChange || !_.isEmpty(selectedTags.parody)) {
      previousSelectedTags.current.author = selectedTags.author;
      return;
    }
    const isOK = checkNewlySelectedTag(selectedTags.author, 'author');
    if (isOK) {
      const newAuthor = _.last(selectedTags.author) as string;
      if (!_.isEmpty(author_parody) && author_parody[newAuthor]) {
        const parodyOfThisAuthor = author_parody[newAuthor][0];
        setSelectedTags({
          ...selectedTags,
          parody: [parodyOfThisAuthor]
        });
      }
      if (!_.isEmpty(author_genre) && author_genre[newAuthor]) {
        const genresOfThisAuthor = [...author_genre[newAuthor]];
        bringCertainTagSuggestionsToFront('genre', genresOfThisAuthor);
      }
    }
    previousSelectedTags.current.author = selectedTags.author;
  }, [selectedTags.author]);
  // On change genre
  useEffect(() => {
    if (
      isFirstRender ||
      !hasChange ||
      _.isEmpty(author_genre) ||
      !_.isEmpty(selectedTags.author)
    ) {
      previousSelectedTags.current.genre = selectedTags.genre;
      return;
    }
    const isOK = checkNewlySelectedTag(selectedTags.genre, 'genre');
    if (isOK) {
      const newGenre = _.last(selectedTags.genre) as string;
      const authorsHaveThisGenre = _.reduce(
        author_genre,
        (accumulator: string[], genres, author) => {
          if (genres.includes(newGenre)) accumulator.push(author);
          return accumulator;
        },
        []
      );
      bringCertainTagSuggestionsToFront('author', authorsHaveThisGenre);
    }
    previousSelectedTags.current.genre = selectedTags.genre;
  }, [selectedTags.genre]);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);
  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  /**
   * Ensure newly selected tag is for adding
   * and not a newly created tag.
   */
  const checkNewlySelectedTag = (
    selectedTags: string[],
    tagType: BreakDownTagType
  ) => {
    const isAddingTag =
      selectedTags.length > previousSelectedTags.current[tagType].length;
    if (isAddingTag) {
      const newlySelectedTag = _.last(selectedTags) as string;
      const newlySelectedTagAlreadyExists = allTags.some(
        tag => tag.tagType === tagType && tag.tagName === newlySelectedTag
      );
      if (newlySelectedTagAlreadyExists) return true;
    }
    return false;
  };
  const bringCertainTagSuggestionsToFront = (
    tagKey: BreakDownTagType,
    certainTagSuggestions: string[]
  ) => {
    setTagSuggestions(prevState => {
      return {
        ...prevState,
        [tagKey]: [
          ...certainTagSuggestions,
          ..._.difference(prevState[tagKey], certainTagSuggestions)
        ]
      };
    });
  };

  const onSelectTag = (tagKey: BreakDownTagType, selectedTag: string) => {
    const isDeselecting = selectedTags[tagKey].includes(selectedTag);
    if (isDeselecting) onRemoveTag(tagKey, selectedTag);
    else onAddTag(tagKey, selectedTag);
  };

  const onAddTag = (tagKey: BreakDownTagType, addedTag: string) => {
    setHasChange(true);
    const isNewTag = !allTags.find(
      tag => tag.tagType === tagKey && tag.tagName === addedTag
    );
    setSelectedTags(prevState => {
      return { ...prevState, [tagKey]: [...prevState[tagKey], addedTag] };
    });
    if (isNewTag)
      setTagSuggestions(prevState => {
        return {
          ...prevState,
          [tagKey]: [...prevState[tagKey], addedTag]
        };
      });
  };
  const onRemoveTag = (tagKey: BreakDownTagType, removedTag: string) => {
    setHasChange(true);
    const isNewTag = !allTags.find(
      tag => tag.tagType === tagKey && tag.tagName === removedTag
    );
    setSelectedTags(prevState => {
      return {
        ...prevState,
        [tagKey]: prevState[tagKey].filter(t => t !== removedTag)
      };
    });
    if (isNewTag)
      setTagSuggestions(prevState => {
        return {
          ...prevState,
          [tagKey]: prevState[tagKey].filter(t => t !== removedTag)
        };
      });
  };

  const breakDownTags = (source: Tag[]) => {
    return source.reduce(
      (accumulator: Record<BreakDownTagType, string[]>, currentValue) => {
        const newValue: Record<BreakDownTagType, string[]> = {
          ...accumulator
        };
        switch (currentValue.tagType) {
          case 'author':
          case 'parody':
          case 'character':
          case 'genre':
            newValue[currentValue.tagType].push(currentValue.tagName);
        }
        return { ...accumulator, ...newValue };
      },
      { author: [], parody: [], character: [], genre: [] }
    );
  };
  const transformSelectedTags = () => {
    const result = _.reduce(
      selectedTags,
      (accumulator, value, key) => {
        switch (key) {
          case 'author':
          case 'parody':
          case 'character':
          case 'genre':
            {
              const tags = value.map(tag => {
                return { tagType: key, tagName: tag };
              });
              accumulator.push(...tags);
            }
            break;
        }
        return accumulator;
      },
      [] as Tag[]
    );
    return result;
  };
  const getNewlyCreatedTags = (selectedTags: Tag[]) => {
    const newTags: Tag[] = [];
    const existingTags: Tag[] = [];
    selectedTags.forEach(selectedTag => {
      const selectedTagAlreadyExists =
        allTags.find(
          tag =>
            tag.tagType === selectedTag.tagType &&
            tag.tagName === selectedTag.tagName
        ) !== undefined;
      if (selectedTagAlreadyExists) existingTags.push(selectedTag);
      else newTags.push(selectedTag);
    });
    return { existingTags, newTags };
  };

  const onSave = async () => {
    switch (dialogType) {
      case TagAction.Add:
      case TagAction.Edit:
        upsertTagsToFolders();
        break;
      case TagAction.Remove:
        removeTagsFromFolders();
        break;
    }
  };
  const onSaveSuccess = () => {
    showMessage.success(MESSAGE.SUCCESS);
    onClose();
  };

  const upsertTagsToFolders = () => {
    const selectedCategory = selectedCategoryRef.current;
    const selectedLanguage = selectedLanguageRef.current;
    const transformedSelectedTags = transformSelectedTags();
    const { existingTags, newTags } = getNewlyCreatedTags(
      transformedSelectedTags
    );
    let category: string | undefined | null = selectedCategory;
    if (category === defaultSuggestion) category = undefined;
    else if (category === noneSuggestion) category = null;
    let language: string | undefined | null = selectedLanguage;
    if (language === defaultSuggestion) language = undefined;
    else if (language === noneSuggestion) language = null;

    modifyTagsOfFolders({
      folderLocations: selectedFolders,
      existingTags,
      newTags,
      category,
      language,
      action: dialogType,
      onSuccess: onSaveSuccess
    });
  };
  const removeTagsFromFolders = () => {
    const transformedSelectedTags = transformSelectedTags();
    modifyTagsOfFolders({
      folderLocations: selectedFolders,
      existingTags: transformedSelectedTags,
      newTags: [],
      action: dialogType,
      onSuccess: onSaveSuccess
    });
  };

  return (
    <section className="folder-dialog_content_container">
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Category</div>
        <div className="folder-dialog_content_row_select">
          <CustomSuggest
            inputId={ELEMENT_ID.FOLDER_DIALOG_INPUT('category')}
            selectedItem={selectedCategory}
            items={[noneSuggestion, ...categories]}
            isDisabled={dialogType === TagAction.Remove}
            updateSelectedItem={setSelectedCategory}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Language</div>
        <div className="folder-dialog_content_row_select">
          <CustomSuggest
            inputId={ELEMENT_ID.FOLDER_DIALOG_INPUT('language')}
            selectedItem={selectedLanguage}
            items={[noneSuggestion, ...languages]}
            isDisabled={dialogType === TagAction.Remove}
            updateSelectedItem={setSelectedLanguage}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Author</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            inputId={ELEMENT_ID.FOLDER_DIALOG_INPUT(1)}
            itemKey="author"
            allItems={tagSuggestions.author}
            selectedItems={selectedTags.author}
            onSelectItem={onSelectTag}
            onRemoveItem={onRemoveTag}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Parody</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            inputId={ELEMENT_ID.FOLDER_DIALOG_INPUT(2)}
            itemKey="parody"
            allItems={tagSuggestions.parody}
            selectedItems={selectedTags.parody}
            onSelectItem={onSelectTag}
            onRemoveItem={onRemoveTag}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Character</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            inputId={ELEMENT_ID.FOLDER_DIALOG_INPUT(3)}
            itemKey="character"
            allItems={tagSuggestions.character}
            selectedItems={selectedTags.character}
            onSelectItem={onSelectTag}
            onRemoveItem={onRemoveTag}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Genre</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            inputId={ELEMENT_ID.FOLDER_DIALOG_INPUT(4)}
            itemKey="genre"
            allItems={tagSuggestions.genre}
            selectedItems={selectedTags.genre}
            onSelectItem={onSelectTag}
            onRemoveItem={onRemoveTag}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row folder-dialog_footer_container">
        <Button
          text="Save"
          intent={Intent.PRIMARY}
          className="folder-dialog_save-button"
          onClick={onSave}
        />
      </div>
    </section>
  );
};

export default DialogContent;
