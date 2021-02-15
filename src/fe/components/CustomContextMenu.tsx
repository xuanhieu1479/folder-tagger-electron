import React from 'react';
import { Menu, MenuItem, Divider } from '@blueprintjs/core';
import { FunctionsContext } from '../../common/interfaces/feInterfaces';
import { TagAction } from '../../common/enums/commonEnums';
import { removeAllTagsFromFolders } from '../redux/tag/tagAction';

interface CustomContextMenu extends FunctionsContext {
  selectedFolders: string[];
}

const CustomContextMenu = ({
  selectedFolders,
  dialog,
  directory
}: CustomContextMenu): React.ReactElement => {
  const { onOpenFolderDialog, onOpenClipboardDialog } = dialog;
  const { onOpenFolderInExplorer, onOpenFolderInExternalProgram } = directory;

  const onClickAddTags = () => onOpenFolderDialog(TagAction.Add);
  const onClickEditTags = () => onOpenFolderDialog(TagAction.Edit);
  const onClickRemoveTags = () => onOpenFolderDialog(TagAction.Remove);
  const onClickCopyTags = () => onOpenClipboardDialog();
  const onClickRemoveAllTags = () => removeAllTagsFromFolders(selectedFolders);
  const onClickOpenFolder = () => onOpenFolderInExplorer();
  const onClickExecuteEternalProgram = () => onOpenFolderInExternalProgram();

  return (
    <Menu>
      <MenuItem
        text="Open In Mangareader"
        onClick={onClickExecuteEternalProgram}
        label="Ctrl + Q"
      />
      <MenuItem
        text="Open In Explorer"
        onClick={onClickOpenFolder}
        label="Ctrl + W"
      />
      <Divider />
      <MenuItem text="Add Tags" onClick={onClickAddTags} label="Ctrl + E" />
      <MenuItem text="Edit Tags" onClick={onClickEditTags} label="Ctrl + S" />
      <MenuItem
        text="Remove Tags"
        onClick={onClickRemoveTags}
        label="Ctrl + D"
      />
      <Divider />
      <MenuItem text="Copy Tags" onClick={onClickCopyTags} label="Ctrl + C" />
      <MenuItem text="Remove All Tags" onClick={onClickRemoveAllTags} />
    </Menu>
  );
};

export default CustomContextMenu;
