import React, { ReactElement } from 'react';
import { Dialog } from '@blueprintjs/core';
import { CommonDialog } from '../../../common/interfaces/feInterfaces';
import { TagAction } from '../../../common/enums/commonEnums';
import DialogContent from './DialogContent';
import './FolderDialog.styled.scss';

interface FolderDialog extends CommonDialog {
  dialogType: TagAction;
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
