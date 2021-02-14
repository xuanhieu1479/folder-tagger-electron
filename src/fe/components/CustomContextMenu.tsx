import React from 'react';
import { Menu, MenuItem, Divider } from '@blueprintjs/core';
import { TagAction } from '../../common/enums/commonEnums';
import { removeAllTagsFromFolders } from '../redux/tag/tagAction';

interface CustomContextMenu {
  selectedFolders: string[];
  onOpenFolderDialog: (dialogType: TagAction) => void;
  onOpenClipboardDialog: () => void;
}

const CustomContextMenu = ({
  selectedFolders,
  onOpenFolderDialog,
  onOpenClipboardDialog
}: CustomContextMenu): React.ReactElement => {
  const onClickAddTags = () => onOpenFolderDialog(TagAction.Add);
  const onClickEditTags = () => onOpenFolderDialog(TagAction.Edit);
  const onClickRemoveTags = () => onOpenFolderDialog(TagAction.Remove);
  const onClickCopyTags = () => onOpenClipboardDialog();
  const onClickRemoveAllTags = () => removeAllTagsFromFolders(selectedFolders);

  return (
    <Menu>
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
