import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { DIALOG } from '../../../common/variables/commonVariables';
import DialogSuggest from './DialogSuggest';
import DialogMultiSelect from './DialogMultiSelect';
import { getTags } from '../../redux/tag/tagAction';

interface DialogContentInterface {
  dialogType: string;
}

const DialogContent = ({
  dialogType
}: DialogContentInterface): ReactElement => {
  const dispatch = useDispatch();
  const { categories, languages } = useSelector(
    (state: RootState) => state.folder
  );
  const { artist, group, parody, character, genre } = useSelector(
    (state: RootState) => state.tag
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedArtists, setSelectedArtists] = useState<Array<string>>([]);
  const [selectedGroups, setSelectedGroups] = useState<Array<string>>([]);
  const [selectedParodies, setSelectedParodies] = useState<Array<string>>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Array<string>>(
    []
  );
  const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);

  useEffect(() => {
    getTags(dispatch);
  }, []);

  const onSave = () => {
    switch (dialogType) {
      case DIALOG.ADD_TAGS:
        console.log(DIALOG.ADD_TAGS);
        break;
      case DIALOG.EDIT_TAGS:
        console.log(DIALOG.EDIT_TAGS);
        break;
      case DIALOG.REMOVE_TAGS:
        console.log(DIALOG.REMOVE_TAGS);
        break;
    }
  };

  return (
    <section className="folder-dialog_content_container">
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Category</div>
        <div className="folder-dialog_content_row_select">
          <DialogSuggest
            selectedItem={selectedCategory}
            items={categories}
            updateSelectedItem={setSelectedCategory}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Language</div>
        <div className="folder-dialog_content_row_select">
          <DialogSuggest
            selectedItem={selectedLanguage}
            items={languages}
            updateSelectedItem={setSelectedLanguage}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Artist</div>
        <div className="folder-dialog_content_row_tags">
          <DialogMultiSelect
            selectedItems={selectedArtists}
            items={artist}
            updateSelectedItems={setSelectedArtists}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Group</div>
        <div className="folder-dialog_content_row_tags">
          <DialogMultiSelect
            selectedItems={selectedGroups}
            items={group}
            updateSelectedItems={setSelectedGroups}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Parody</div>
        <div className="folder-dialog_content_row_tags">
          <DialogMultiSelect
            selectedItems={selectedParodies}
            items={parody}
            updateSelectedItems={setSelectedParodies}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Character</div>
        <div className="folder-dialog_content_row_tags">
          <DialogMultiSelect
            selectedItems={selectedCharacters}
            items={character}
            updateSelectedItems={setSelectedCharacters}
          />
        </div>
      </div>
      <div className="folder-dialog_content_row">
        <div className="folder-dialog_content_row_title">Genre</div>
        <div className="folder-dialog_content_row_tags">
          <DialogMultiSelect
            selectedItems={selectedGenres}
            items={genre}
            updateSelectedItems={setSelectedGenres}
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
