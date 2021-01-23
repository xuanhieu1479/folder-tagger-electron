import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION, DIALOG } from '../../../common/variables/commonVariables';
import { FolderDialog, SettingDialog } from '../../components/commonComponents';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { getFolders } from '../../redux/folder/folderAction';
import './FoldersDisplay.styled.scss';

interface FolderDialogParamsInterface {
  isOpen?: boolean;
  dialogType?: string;
}

const defaultParams = {
  currentPage: 1,
  itemsPerPage: PAGINATION.ITEMS_PER_PAGE[0]
};

const FoldersDisplay = (): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders } = useSelector((state: RootState) => state.folder);
  const updatedSelectedFolders = useRef(selectedFolders);
  const [params, setParams] = useState(defaultParams);
  const [folderDialogParams, SetFolderDialogParams] = useState({
    isOpen: false,
    dialogType: DIALOG.ADD_TAGS
  });
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);

  useEffect(() => {
    const keyDownListerner = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'e':
            if (updatedSelectedFolders.current.length > 0)
              updateFolderDialog({ isOpen: true, dialogType: DIALOG.ADD_TAGS });
            break;
          case 't':
            setIsSettingDialogOpen(true);
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

  const updateFolderDialog = (newParams: FolderDialogParamsInterface): void => {
    SetFolderDialogParams({ ...folderDialogParams, ...newParams });
  };

  const onCloseFolderDialog = () => {
    updateFolderDialog({ isOpen: false });
  };
  const onCloseSettingDialog = () => {
    setIsSettingDialogOpen(false);
  };

  return (
    <>
      <section className="folder-display_container">
        <Body />
        <Footer updateParams={updateParams} />
      </section>
      <FolderDialog onClose={onCloseFolderDialog} {...folderDialogParams} />
      <SettingDialog
        isOpen={isSettingDialogOpen}
        onClose={onCloseSettingDialog}
        title="Settings"
      />
    </>
  );
};

export default FoldersDisplay;
