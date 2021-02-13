import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Dialog, Checkbox, Label, Button, Intent } from '@blueprintjs/core';
import { BreakDownTagType } from '../../common/interfaces/commonInterfaces';
import { RootState } from '../../common/interfaces/feInterfaces';
import { copyTags } from '../redux/tag/tagAction';
import './styles/ClipboardDialog.styled.scss';

interface FolderDialog {
  isOpen: boolean;
  onClose: () => void;
}
const defaultCheckedValues = {
  author: true,
  parody: false,
  character: false,
  genre: false
};

const FolderDialog = ({ isOpen, onClose }: FolderDialog): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders } = useSelector((state: RootState) => state.folder);
  const [tagTypes, setTagTypes] = useState({
    ...defaultCheckedValues
  });
  const [isAllCheckboxChecked, setAllCheckboxChecked] = useState(false);
  const [isAllCheckboxIndetermidate, setAllCheckboxIndeterminate] = useState(
    false
  );

  useEffect(() => {
    if (isOpen) setTagTypes({ ...defaultCheckedValues });
  }, [isOpen]);

  useEffect(() => {
    const checkedTagTypes = _.filter(tagTypes, isChecked => isChecked);
    const checkedTagTypesCount = checkedTagTypes.length;
    const allTagTypesCount = Object.keys(tagTypes).length;
    const noTagTypeIsChecked = checkedTagTypesCount === 0;
    const allTagTypesAreChecked = checkedTagTypesCount === allTagTypesCount;
    const someTagTypesAreChecked =
      checkedTagTypesCount > 0 && checkedTagTypesCount < allTagTypesCount;

    if (noTagTypeIsChecked) {
      setAllCheckboxChecked(false);
      setAllCheckboxIndeterminate(false);
    }
    if (allTagTypesAreChecked) {
      setAllCheckboxChecked(true);
      setAllCheckboxIndeterminate(false);
    }
    if (someTagTypesAreChecked) setAllCheckboxIndeterminate(true);
  }, [tagTypes]);

  const onChangeCheckBox = (
    tagKey: BreakDownTagType,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setTagTypes({
      ...tagTypes,
      [tagKey]: event.currentTarget.checked
    });
  };
  const onChangeAllCheckBox = (event: React.FormEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget;
    setAllCheckboxChecked(checked);
    setTagTypes({
      author: checked,
      parody: checked,
      character: checked,
      genre: checked
    });
  };

  const onSuccess = () => {
    onClose();
  };

  const onCopyTags = () => {
    const includedTagTypes = _.reduce(
      tagTypes,
      (accumulator: BreakDownTagType[], isChecked, tagType) => {
        switch (tagType) {
          case 'author':
          case 'parody':
          case 'character':
          case 'genre':
            if (isChecked) accumulator.push(tagType);
            break;
        }
        return accumulator;
      },
      []
    );
    if (!_.isEmpty(includedTagTypes))
      copyTags(dispatch, selectedFolders[0], includedTagTypes, onSuccess);
    else onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="clipboard-dialog_container"
    >
      <section className="clipboard-dialog_content-container">
        <Label className="clipboard-dialog_label">
          Choose what to copy to clipboard
        </Label>
        <Checkbox
          checked={isAllCheckboxChecked}
          label="All"
          indeterminate={isAllCheckboxIndetermidate}
          onChange={onChangeAllCheckBox}
        />
        <Checkbox
          checked={tagTypes.author}
          label="Author"
          onChange={event => onChangeCheckBox('author', event)}
        />
        <Checkbox
          checked={tagTypes.parody}
          label="Parody"
          onChange={event => onChangeCheckBox('parody', event)}
        />
        <Checkbox
          checked={tagTypes.character}
          label="Character"
          onChange={event => onChangeCheckBox('character', event)}
        />
        <Checkbox
          checked={tagTypes.genre}
          label="Genre"
          onChange={event => onChangeCheckBox('genre', event)}
        />
        <Button
          intent={Intent.PRIMARY}
          className="clipboard-dialog_save-button"
          onClick={onCopyTags}
        >
          OK
        </Button>
      </section>
    </Dialog>
  );
};

export default FolderDialog;
