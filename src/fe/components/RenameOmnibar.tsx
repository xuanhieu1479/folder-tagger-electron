import React, { ReactElement, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Omnibar, ItemRenderer } from '@blueprintjs/select';
import { MESSAGE } from '../../common/variables/commonVariables';
import {
  getFolderDirectory,
  getFolderName,
  fileExists
} from '../../utilities/utilityFunctions';
import { showMessage } from '../../utilities/feUtilities';
import { renameFolder } from '../redux/folder/folderAction';

interface RenameOmnibar {
  isOpen: boolean;
  folderName: string;
  onClose: () => void;
}

const RenameOmnibar = ({
  isOpen,
  folderName,
  onClose
}: RenameOmnibar): ReactElement => {
  const dispatch = useDispatch();
  const name = getFolderName(folderName);
  const directory = getFolderDirectory(folderName);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen) setInput(name);
    else setInput('');
  }, [isOpen, folderName]);

  const onChangeInput = (query: string) => {
    setInput(query);
  };
  const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const oldName = name.trim();
    const newName = input.trim();
    const newLocation = `${directory}\\${newName}`;
    if (key === 'Enter') {
      if (newName === oldName) onClose();
      else if (!newName) showMessage.error(MESSAGE.EMPTY_FOLDER_NAME);
      else if (fileExists(newLocation))
        showMessage.error(MESSAGE.DUPLICATE_NEW_NAME);
      else {
        renameFolder(dispatch, { oldLocation: folderName, newLocation });
        onClose();
      }
    }
  };

  const renderSelectItems: ItemRenderer<string> = () => null;

  return (
    <Omnibar
      items={[]}
      itemRenderer={renderSelectItems}
      onItemSelect={() => undefined}
      isOpen={isOpen}
      onClose={onClose}
      query={input}
      onQueryChange={onChangeInput}
      inputProps={{ onKeyDown: onPressEnter }}
    />
  );
};

export default RenameOmnibar;
