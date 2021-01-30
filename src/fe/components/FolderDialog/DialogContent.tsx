import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import _ from 'lodash';
import { Tags } from '../../../common/interfaces/commonInterfaces';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { TAG_ACTION, MESSAGE } from '../../../common/variables/commonVariables';
import { CustomSuggest, CustomMultiSelect } from '../commonComponents';
import { showMessage } from '../../../utility/showMessage';
import { getTags, modifyTagsOfFolders } from '../../redux/tag/tagAction';

interface DialogContentInterface {
  dialogType: string;
  onClose: () => void;
}
type BreakDownTagsType =
  | 'artist'
  | 'group'
  | 'parody'
  | 'character'
  | 'genre'
  | string;
const defaultSelectedTags = {
  artist: [],
  group: [],
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
  const { allTags } = useSelector((state: RootState) => state.tag);
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

    getTags(dispatch);
    if (dialogType === TAG_ACTION.EDIT) getSelectedFolderTags();
  }, []);

  const updateSelectedTags = (
    tagKey: string,
    newSelectedTags: Array<string>
  ) => {
    setSelectedTags(prevState => {
      return { ...prevState, [tagKey]: newSelectedTags };
    });
  };

  const breakDownTags = (source: Array<Tags>) => {
    return source.reduce(
      (accumulator, currentValue) => {
        const newValue: Record<BreakDownTagsType, Array<string>> = {
          ...accumulator
        };
        newValue[currentValue.tagType].push(currentValue.tagName);
        return { ...accumulator, ...newValue };
      },
      { artist: [], group: [], parody: [], character: [], genre: [] }
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
      if (
        allTags.find(
          tag =>
            tag.tagType === selectedTag.tagType &&
            tag.tagName === selectedTag.tagName
        )
      )
        existingTags.push(selectedTag);
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

  const allItems = useMemo(() => breakDownTags(allTags), [allTags]);

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
        <div className="folder-dialog_content_row_title">Artist</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            itemKey="artist"
            allItems={allItems.artist}
            selectedItems={selectedTags.artist}
            updateSelectedItems={updateSelectedTags}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Group</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            itemKey="group"
            allItems={allItems.group}
            selectedItems={selectedTags.group}
            updateSelectedItems={updateSelectedTags}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Parody</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            itemKey="parody"
            allItems={allItems.parody}
            selectedItems={selectedTags.parody}
            updateSelectedItems={updateSelectedTags}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Character</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            itemKey="character"
            allItems={allItems.character}
            selectedItems={selectedTags.character}
            updateSelectedItems={updateSelectedTags}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Genre</div>
        <div className="folder-dialog_content_row_tags">
          <CustomMultiSelect
            itemKey="genre"
            allItems={allItems.genre}
            selectedItems={selectedTags.genre}
            updateSelectedItems={updateSelectedTags}
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
