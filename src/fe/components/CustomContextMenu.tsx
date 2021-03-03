import React from 'react';
import { Menu, MenuItem, Divider } from '@blueprintjs/core';
import {
  FunctionsContext,
  SettingShortcut
} from '../../common/interfaces/feInterfaces';
import { TagAction } from '../../common/enums/commonEnums';
import { removeAllTagsFromFolders } from '../redux/tag/tagAction';

interface CustomContextMenu extends FunctionsContext {
  selectedFolders: string[];
  shortcut: SettingShortcut;
}

const CustomContextMenu = ({
  selectedFolders,
  shortcut,
  dialog,
  directory
}: CustomContextMenu): React.ReactElement => {
  const {
    onOpenFolderDialog,
    onOpenClipboardDialog,
    onOpenRenameOmnibar
  } = dialog;
  const { onOpenFolderInExplorer, onOpenFolderInExternalProgram } = directory;
  const {
    addTagsToFolder,
    editTagsOfFolder,
    removeTagsFromFolder,
    openFolderInExplorer,
    openFolderInExternalProgram,
    renameFolder
  } = shortcut;

  const onClickAddTags = () => onOpenFolderDialog(TagAction.Add);
  const onClickEditTags = () => onOpenFolderDialog(TagAction.Edit);
  const onClickRemoveTags = () => onOpenFolderDialog(TagAction.Remove);
  const onClickCopyTags = () => onOpenClipboardDialog();
  const onClickRemoveAllTags = () => removeAllTagsFromFolders(selectedFolders);
  const onClickOpenFolder = () => onOpenFolderInExplorer();
  const onClickExecuteExternalProgram = () => onOpenFolderInExternalProgram();
  const onRenameFolder = () => onOpenRenameOmnibar();

  return (
    <Menu>
      <MenuItem
        text="Open In Mangareader"
        onClick={onClickExecuteExternalProgram}
        label={`Ctrl + ${openFolderInExternalProgram.toUpperCase()}`}
      />
      <MenuItem
        text="Open In Explorer"
        onClick={onClickOpenFolder}
        label={`Ctrl + ${openFolderInExplorer.toUpperCase()}`}
      />
      <MenuItem
        text="Rename Folder"
        onClick={onRenameFolder}
        label={`Ctrl + ${renameFolder.toUpperCase()}`}
      />
      <Divider />
      <MenuItem
        text="Add Tags"
        onClick={onClickAddTags}
        label={`Ctrl + ${addTagsToFolder.toUpperCase()}`}
      />
      <MenuItem
        text="Edit Tags"
        onClick={onClickEditTags}
        label={`Ctrl + ${editTagsOfFolder.toUpperCase()}`}
      />
      <MenuItem
        text="Remove Tags"
        onClick={onClickRemoveTags}
        label={`Ctrl + ${removeTagsFromFolder.toUpperCase()}`}
      />
      <Divider />
      <MenuItem text="Copy Tags" onClick={onClickCopyTags} label="Ctrl + C" />
      <MenuItem text="Remove All Tags" onClick={onClickRemoveAllTags} />
    </Menu>
  );
};

export default CustomContextMenu;
