import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import _ from 'lodash';
import { Tags } from '../../../common/interfaces/commonInterfaces';
import {
  RootState,
  BreakDownTagsType
} from '../../../common/interfaces/feInterfaces';
import { MESSAGE } from '../../../common/variables/commonVariables';
import { TAG_ACTION } from '../../../common/enums/commonEnums';
import { CustomSuggest, CustomMultiSelect } from '../commonComponents';
import { showMessage } from '../../../utilities/feUtilities';
import { getTags, modifyTagsOfFolders } from '../../redux/tag/tagAction';

interface DialogContentInterface {
  dialogType: TAG_ACTION;
  onClose: () => void;
}
const defaultSelectedTags: Record<BreakDownTagsType, Array<string>> = {
  author: [],
  parody: [],
  character: [],
  genre: []
};
const defaultSuggestion = '';

const DialogContent = ({
  dialogType,
  onClose
}: DialogContentInterface): ReactElement => {
  const dispatch = useDispatch();
  const { categories, languages, selectedFolders } = useSelector(
    (state: RootState) => state.folder
  );
  const { relations } = useSelector((state: RootState) => state.tag);
  const { parody_character, author_parody, author_genre } = relations;
  const { allTags } = useSelector((state: RootState) => state.tag);
  const [tagSuggestions, setTagSuggestions] = useState(defaultSelectedTags);
  const [selectedCategory, setSelectedCategory] = useState(defaultSuggestion);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultSuggestion);
  const [selectedTags, setSelectedTags] = useState(defaultSelectedTags);

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
        const brokenDownTags = breakDownTags(selectedFolderTags);
        setSelectedTags(brokenDownTags);
        setSelectedCategory(selectedFolderCategory);
        setSelectedLanguage(selectedFolderLanguage);
      }
    };
    if (dialogType === TAG_ACTION.EDIT) getSelectedFolderTags();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(allTags)) setTagSuggestions(breakDownTags(allTags));
  }, [allTags]);

  const bringCertainTagSuggestionsToFront = (
    tagKey: BreakDownTagsType,
    certainTagSuggestions: Array<string>
  ) => {
    setTagSuggestions({
      ...tagSuggestions,
      [tagKey]: [
        ...certainTagSuggestions,
        ..._.difference(tagSuggestions[tagKey], certainTagSuggestions)
      ]
    });
  };

  const onSelectTag = (tagKey: BreakDownTagsType, selectedTag: string) => {
    const seletecTagIsANewTag = !allTags.find(
      tag => tag.tagType === tagKey && tag.tagName === selectedTag
    );
    const isDeselecting = selectedTags[tagKey].includes(selectedTag);
    const hasNoParodyCharacterRelations = _.isEmpty(parody_character);
    const hasNoAuthorParodyRelations = _.isEmpty(author_parody);
    const hasNoAuthorGenreRelations = _.isEmpty(author_genre);

    const handleSelectTags = () => {
      if (seletecTagIsANewTag) return;
      switch (tagKey) {
        case 'character':
          {
            if (
              hasNoParodyCharacterRelations ||
              !_.isEmpty(selectedTags.parody)
            )
              break;
            const parodyOfThisCharacter = _.findKey(
              parody_character,
              character => character.includes(selectedTag)
            );
            if (parodyOfThisCharacter) {
              bringCertainTagSuggestionsToFront('character', [
                ...parody_character[parodyOfThisCharacter]
              ]);
              setSelectedTags({
                ...selectedTags,
                parody: [parodyOfThisCharacter]
              });
            }
          }
          break;
        case 'parody':
          if (hasNoParodyCharacterRelations) break;
          {
            const thisParodyHasCharacterRelations = Object.keys(
              parody_character
            ).includes(selectedTag);
            if (thisParodyHasCharacterRelations) {
              bringCertainTagSuggestionsToFront('character', [
                ...parody_character[selectedTag]
              ]);
            }
          }
          break;
      }
    };

    if (isDeselecting) {
      onRemoveTag(tagKey, selectedTag);
      return;
    }
    handleSelectTags();
    onAddTag(tagKey, selectedTag);
  };

  const onAddTag = (tagKey: BreakDownTagsType, addedTag: string) => {
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
  const onRemoveTag = (tagKey: BreakDownTagsType, removedTag: string) => {
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

  const breakDownTags = (source: Array<Tags>) => {
    return source.reduce(
      (accumulator: Record<BreakDownTagsType, Array<string>>, currentValue) => {
        const newValue: Record<BreakDownTagsType, Array<string>> = {
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
    const defaultResult: Array<Tags> = [];
    const result = _.reduce(
      selectedTags,
      (accumulator, value, key) => {
        const tags = value.map(tag => {
          return { tagType: key, tagName: tag };
        });
        accumulator.push(...tags);
        return accumulator;
      },
      defaultResult
    );
    return result;
  };
  const getNewlyCreatedTags = (selectedTags: Array<Tags>) => {
    const newTags: Array<Tags> = [];
    const existingTags: Array<Tags> = [];
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
      case TAG_ACTION.ADD:
      case TAG_ACTION.EDIT:
        upsertTagsToFolders();
        break;
      case TAG_ACTION.REMOVE:
        removeTagsFromFolders();
        break;
    }
  };
  const onSaveSuccess = () => {
    showMessage.success(MESSAGE.SUCCESS);
    onClose();
  };

  const upsertTagsToFolders = () => {
    const transformedSelectedTags = transformSelectedTags();
    const { existingTags, newTags } = getNewlyCreatedTags(
      transformedSelectedTags
    );
    const category =
      selectedCategory === defaultSuggestion ? undefined : selectedCategory;
    const language =
      selectedLanguage === defaultSuggestion ? undefined : selectedLanguage;
    modifyTagsOfFolders({
      selectedFolders,
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
      selectedFolders,
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
            selectedItem={selectedCategory}
            items={categories}
            isDisabled={dialogType === TAG_ACTION.REMOVE}
            updateSelectedItem={setSelectedCategory}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Language</div>
        <div className="folder-dialog_content_row_select">
          <CustomSuggest
            selectedItem={selectedLanguage}
            items={languages}
            isDisabled={dialogType === TAG_ACTION.REMOVE}
            updateSelectedItem={setSelectedLanguage}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Author</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
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
