import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { DIALOG } from '../../../common/variables/commonVariables';
import DialogSuggest from './DialogSuggest';
import DialogMultiSelect from './DialogMultiSelect';
import { getTags } from '../../redux/tag/tagAction';
import './DialogContent.styled.scss';

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
    <section className="dialog-content-container">
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Category</div>
        <div className="dialog-content-row-select">
          <DialogSuggest
            selectedItem={selectedCategory}
            items={categories}
            updateSelectedItem={setSelectedCategory}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Language</div>
        <div className="dialog-content-row-select">
          <DialogSuggest
            selectedItem={selectedLanguage}
            items={languages}
            updateSelectedItem={setSelectedLanguage}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Artist</div>
        <div className="dialog-content-row-tags">
          <DialogMultiSelect
            selectedItems={selectedArtists}
            items={artist}
            updateSelectedItems={setSelectedArtists}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Group</div>
        <div className="dialog-content-row-tags">
          <DialogMultiSelect
            selectedItems={selectedGroups}
            items={group}
            updateSelectedItems={setSelectedGroups}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Parody</div>
        <div className="dialog-content-row-tags">
          <DialogMultiSelect
            selectedItems={selectedParodies}
            items={parody}
            updateSelectedItems={setSelectedParodies}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Character</div>
        <div className="dialog-content-row-tags">
          <DialogMultiSelect
            selectedItems={selectedCharacters}
            items={character}
            updateSelectedItems={setSelectedCharacters}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Genre</div>
        <div className="dialog-content-row-tags">
          <DialogMultiSelect
            selectedItems={selectedGenres}
            items={genre}
            updateSelectedItems={setSelectedGenres}
          />
        </div>
      </div>
      <div className="dialog-content-row dialog-footer-container">
        <Button
          text="Save"
          intent={Intent.PRIMARY}
          className="dialog-save-button"
          onClick={onSave}
        />
      </div>
    </section>
  );
};

export default DialogContent;
