import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import _ from 'lodash';
import { Tags, LooseObject } from '../../../common/interfaces/commonInterfaces';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { DIALOG, MESSAGE } from '../../../common/variables/commonVariables';
import DialogSuggest from './DialogSuggest';
import DialogMultiSelect from './DialogMultiSelect';
import { showMessage } from '../../../utility/showMessage';
import { getTags, createTags, addTags } from '../../redux/tag/tagAction';

interface DialogContentInterface {
  dialogType: string;
  onClose: () => void;
}
const defaultSelectedTags = {
  artist: [],
  group: [],
  parody: [],
  character: [],
  genre: []
};
const defaultSuggestion = 'none';

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
    getTags(dispatch);
  }, []);

  const updateSelectedTags = (
    tagKey: string,
    newSelectedTags: Array<string>
  ) => {
    setSelectedTags({ ...selectedTags, [tagKey]: newSelectedTags });
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
    return selectedTags.filter(
      tag =>
        !allTags.find(
          t => t.tagType === tag.tagType && t.tagName === tag.tagName
        )
    );
  };

  const onSave = async () => {
    switch (dialogType) {
      case DIALOG.ADD_TAGS:
        await addTagsToFolder();
        break;
      case DIALOG.EDIT_TAGS:
        console.log(DIALOG.EDIT_TAGS);
        break;
      case DIALOG.REMOVE_TAGS:
        console.log(DIALOG.REMOVE_TAGS);
        break;
    }
    showMessage.success(MESSAGE.SUCCESS);
    onClose();
  };

  const addTagsToFolder = async () => {
    const transformedSelectedTags = transformSelectedTags();
    const newTags = getNewlyCreatedTags(transformedSelectedTags);
    const hasNewTags = !_.isEmpty(newTags);
    if (hasNewTags) await createTags(newTags);
    const category =
      selectedCategory === defaultSuggestion ? undefined : selectedCategory;
    const language =
      selectedLanguage === defaultSuggestion ? undefined : selectedLanguage;
    await addTags(selectedFolders, transformedSelectedTags, category, language);
  };

  const allItems = useMemo(
    () =>
      allTags.reduce(
        (accumulator, currentValue) => {
          const newValue: LooseObject = { ...accumulator };
          newValue[currentValue.tagType].push(currentValue.tagName);
          return { ...accumulator, ...newValue };
        },
        { artist: [], group: [], parody: [], character: [], genre: [] }
      ),
    [allTags]
  );

  return (
    <section className="folder-dialog_content_container">
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Category</div>
        <div className="folder-dialog_content_row_select">
          <DialogSuggest
            selectedItem={selectedCategory}
            items={[defaultSuggestion, ...categories]}
            updateSelectedItem={setSelectedCategory}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Language</div>
        <div className="folder-dialog_content_row_select">
          <DialogSuggest
            selectedItem={selectedLanguage}
            items={[defaultSuggestion, ...languages]}
            updateSelectedItem={setSelectedLanguage}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Artist</div>
        <div className="folder-dialog_content_row_tags">
          <DialogMultiSelect
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
          <DialogMultiSelect
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
          <DialogMultiSelect
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
          <DialogMultiSelect
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
          <DialogMultiSelect
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
