import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@blueprintjs/core';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION, DIALOG } from '../../../common/variables/commonVariables';
import { DialogContent } from '../../components/commonComponents';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { getFolders } from '../../redux/folder/folderAction';
import './FoldersDisplay.styled.scss';

const defaultParams = {
  currentPage: 1,
  itemsPerPage: PAGINATION.ITEMS_PER_PAGE[0]
};

const FoldersDisplay = (): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders } = useSelector((state: RootState) => state.folder);
  const updatedSelectedFolders = useRef(selectedFolders);
  const [params, setParams] = useState(defaultParams);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');

  useEffect(() => {
    const keyDownListerner = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'e':
            if (updatedSelectedFolders.current.length > 0)
              setIsDialogOpen(true);
            setDialogTitle(DIALOG.ADD_TAGS);
            break;
        }
      }
    };

    window.addEventListener('keydown', keyDownListerner);
    return () => window.removeEventListener('keydown', keyDownListerner);
  }, []);

  useEffect((): void => {
    const getNewFolders = async () => {
      await getFolders(dispatch, params);
    };

    getNewFolders();
  }, [params]);

  useEffect(() => {
    updatedSelectedFolders.current = selectedFolders;
  }, [selectedFolders]);

  const updateParams = (newParams: FolderFilterParams): void => {
    setParams({ ...params, ...newParams });
  };

  const onCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <section className="folder-display-container">
        <Body />
        <Footer updateParams={updateParams} />
      </section>
      <Dialog
        isOpen={isDialogOpen}
        onClose={onCloseDialog}
        className="dialog-container"
        title={dialogTitle}
      >
        <DialogContent dialogType={DIALOG.ADD_TAGS} />
      </Dialog>
    </>
  );
};

export default FoldersDisplay;
