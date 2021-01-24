import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION, DIALOG } from '../../../common/variables/commonVariables';
import { FolderDialog } from '../../components/commonComponents';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { getFolders } from '../../redux/folder/folderAction';
import './FoldersDisplay.styled.scss';

interface FoldersDisplayInterface {
  openSettingDialog: () => void;
}
const defaultParams = {
  currentPage: 1,
  itemsPerPage: PAGINATION.ITEMS_PER_PAGE[0]
};
const defaultFolderDialogParams = {
  isOpen: false,
  dialogType: DIALOG.ADD_TAGS
};

const FoldersDisplay = ({
  openSettingDialog
}: FoldersDisplayInterface): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders } = useSelector((state: RootState) => state.folder);
  const selectedFoldersRef = useRef(selectedFolders);
  const [params, setParams] = useState(defaultParams);
  const [folderDialogParams, setFolderDialogParams] = useState(
    defaultFolderDialogParams
  );

  useEffect(() => {
    const keyDownListerner = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'e':
            if (!_.isEmpty(selectedFoldersRef.current))
              onOpenAddTagsToFoldersDialog();
            break;
          case 't':
            openSettingDialog();
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
    selectedFoldersRef.current = selectedFolders;
  }, [selectedFolders]);

  const updateParams = (newParams: FolderFilterParams): void => {
    setParams({ ...params, ...newParams });
  };

  const onOpenAddTagsToFoldersDialog = () => {
    setFolderDialogParams({ isOpen: true, dialogType: DIALOG.ADD_TAGS });
  };
  const onCloseFolderDialog = () => {
    setFolderDialogParams(defaultFolderDialogParams);
  };

  return (
    <>
      <section className="folder-display_container">
        <Body />
        <Footer updateParams={updateParams} />
      </section>
      <FolderDialog onClose={onCloseFolderDialog} {...folderDialogParams} />
    </>
  );
};

export default FoldersDisplay;
