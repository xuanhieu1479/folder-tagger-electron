import React, { ReactElement } from 'react';
import { Dialog } from '@blueprintjs/core';
import { TAG_ACTION } from '../../../common/enums/commonEnums';
import DialogContent from './DialogContent';
import './FolderDialog.styled.scss';

interface FolderDialog {
  isOpen: boolean;
  onClose: () => void;
  dialogType: TAG_ACTION;
}

const FolderDialog = ({
  isOpen,
  onClose,
  dialogType
}: FolderDialog): ReactElement => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogType}
      className="folder-dialog_container"
    >
      <DialogContent dialogType={dialogType} onClose={onClose} />
    </Dialog>
  );
};

export default FolderDialog;
