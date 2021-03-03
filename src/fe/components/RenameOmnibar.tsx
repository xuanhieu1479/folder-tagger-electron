import React, { ReactElement, useState, useEffect } from 'react';
import { Omnibar, ItemRenderer } from '@blueprintjs/select';
import { MESSAGE } from '../../common/variables/commonVariables';
import {
  getFolderDirectory,
  getFolderName,
  fileExists
} from '../../utilities/directoryUtilities';
import { showMessage } from '../../utilities/feUtilities';

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
    const newName = input.trim();
    const oldName = name.trim();
    if (key === 'Enter') {
      if (newName === oldName) onClose();
      else if (fileExists(`${directory}\\${newName}`))
        showMessage.error(MESSAGE.DUPLICATE_NEW_NAME);
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
