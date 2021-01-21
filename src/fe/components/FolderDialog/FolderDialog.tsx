import React, { ReactElement } from 'react';
import { Dialog } from '@blueprintjs/core';
import DialogContent from './DialogContent';

interface FolderDialogInterface {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  dialogType: string;
}

const FolderDialog = ({
  isOpen,
  onClose,
  className,
  dialogType
}: FolderDialogInterface): ReactElement => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      title={dialogType}
    >
      <DialogContent dialogType={dialogType} />
    </Dialog>
  );
};

export default FolderDialog;
