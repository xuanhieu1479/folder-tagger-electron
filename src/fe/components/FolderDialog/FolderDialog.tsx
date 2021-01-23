import React, { ReactElement } from 'react';
import { Dialog } from '@blueprintjs/core';
import DialogContent from './DialogContent';
import './FolderDialog.styled.scss';

interface FolderDialogInterface {
  isOpen: boolean;
  onClose: () => void;
  dialogType: string;
}

const FolderDialog = ({
  isOpen,
  onClose,
  dialogType
}: FolderDialogInterface): ReactElement => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogType}
      className="folder-dialog_container"
    >
      <DialogContent dialogType={dialogType} />
    </Dialog>
  );
};

export default FolderDialog;
