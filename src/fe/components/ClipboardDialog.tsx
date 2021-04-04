import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Dialog, Checkbox, Label, Button, Intent } from '@blueprintjs/core';
import { BreakDownTagType } from '../../common/interfaces/commonInterfaces';
import { RootState, CommonDialog } from '../../common/interfaces/feInterfaces';
import { copyTags } from '../redux/tag/tagAction';
import { updateSettings } from '../redux/setting/settingAction';
import './styles/ClipboardDialog.styled.scss';

const defaultCheckedValues = {
  author: true,
  parody: false,
  character: false,
  genre: false
};

const ClipboardDialog = ({ isOpen, onClose }: CommonDialog): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders } = useSelector((state: RootState) => state.folder);
  const { setting } = useSelector((state: RootState) => state);
  const { clipboard } = setting;
  const [tagTypes, setTagTypes] = useState({ ...defaultCheckedValues });
  const [isAllCheckboxChecked, setAllCheckboxChecked] = useState(false);
  const [isAllCheckboxIndetermidate, setAllCheckboxIndeterminate] = useState(
    false
  );
  const tagTypesRef = useRef(tagTypes);

  useEffect(() => {
    const onKeyDownListerner = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onOK();
      }
    };

    if (isOpen) window.addEventListener('keydown', onKeyDownListerner);
    return () => window.removeEventListener('keydown', onKeyDownListerner);
  }, [isOpen]);

  useEffect(() => {
    tagTypesRef.current = tagTypes;
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

  useEffect(() => {
    if (!isOpen) return;
    const defaultValues = _.reduce(
      clipboard,
      (acc, value, key) => {
        switch (key) {
          case 'author':
          case 'parody':
          case 'character':
          case 'genre':
            acc[key] = value === 'yes';
            break;
        }
        return acc;
      },
      defaultCheckedValues
    );
    setTagTypes(prevState => ({ ...prevState, ...defaultValues }));
    tagTypesRef.current = defaultValues;
  }, [clipboard, isOpen]);

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
  const onChangeDefaultCheckBox = (
    tagKey: BreakDownTagType,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    updateSettings(dispatch, {
      ...setting,
      clipboard: {
        ...clipboard,
        [tagKey]: event.currentTarget.checked ? 'yes' : 'no'
      }
    });
  };

  const onOK = () => {
    const tagTypes = tagTypesRef.current;
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
      copyTags(dispatch, selectedFolders[0], includedTagTypes, onClose);
    else onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="clipboard-dialog_container"
    >
      <section className="clipboard-dialog_content_container">
        <Label className="clipboard-dialog_label">
          Choose what to copy to clipboard
        </Label>
        <div className="clipboard-dialog_row">
          <Checkbox
            checked={isAllCheckboxChecked}
            label="All"
            indeterminate={isAllCheckboxIndetermidate}
            onChange={onChangeAllCheckBox}
          />
          Is Default
        </div>
        <div className="clipboard-dialog_row">
          <Checkbox
            checked={tagTypes.author}
            label="Author"
            onChange={event => onChangeCheckBox('author', event)}
          />
          <Checkbox
            tabIndex={-1}
            checked={clipboard.author === 'yes'}
            onChange={event => onChangeDefaultCheckBox('author', event)}
          />
        </div>
        <div className="clipboard-dialog_row">
          <Checkbox
            checked={tagTypes.parody}
            label="Parody"
            onChange={event => onChangeCheckBox('parody', event)}
          />
          <Checkbox
            tabIndex={-1}
            checked={clipboard.parody === 'yes'}
            onChange={event => onChangeDefaultCheckBox('parody', event)}
          />
        </div>
        <div className="clipboard-dialog_row">
          <Checkbox
            checked={tagTypes.character}
            label="Character"
            onChange={event => onChangeCheckBox('character', event)}
          />
          <Checkbox
            tabIndex={-1}
            checked={clipboard.character === 'yes'}
            onChange={event => onChangeDefaultCheckBox('character', event)}
          />
        </div>
        <div className="clipboard-dialog_row">
          <Checkbox
            checked={tagTypes.genre}
            label="Genre"
            onChange={event => onChangeCheckBox('genre', event)}
          />
          <Checkbox
            tabIndex={-1}
            checked={clipboard.genre === 'yes'}
            onChange={event => onChangeDefaultCheckBox('genre', event)}
          />
        </div>
        <Button
          intent={Intent.PRIMARY}
          className="clipboard-dialog_save-button"
          onClick={onOK}
        >
          OK
        </Button>
      </section>
    </Dialog>
  );
};

export default ClipboardDialog;
