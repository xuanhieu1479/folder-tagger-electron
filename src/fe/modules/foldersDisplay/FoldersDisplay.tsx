import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import {
  PAGINATION,
  DIALOG,
  ELEMENT_ID
} from '../../../common/variables/commonVariables';
import { FolderDialog } from '../../components/commonComponents';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { SELECT_FOLDERS } from '../../redux/folder/folderActionType';
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
  const { selectedFolders, foldersList } = useSelector(
    (state: RootState) => state.folder
  );
  const selectedFoldersRef = useRef(selectedFolders);
  const foldersListRef = useRef(foldersList);
  const [params, setParams] = useState(defaultParams);
  const [folderDialogParams, setFolderDialogParams] = useState(
    defaultFolderDialogParams
  );

  useEffect(() => {
    const keyDownListerner = (event: KeyboardEvent) => {
      const selectedFolders = selectedFoldersRef.current;
      const foldersList = foldersListRef.current.map(folder => folder.location);
      if (event.ctrlKey) {
        switch (event.key) {
          case 'e':
            if (!_.isEmpty(selectedFolders)) onOpenAddTagsToFoldersDialog();
            break;
          case 't':
            openSettingDialog();
            break;
        }
      } else {
        if (_.isEmpty(selectedFolders) || foldersList.length <= 1) return;
        const isHoldingShift = event.shiftKey;
        const firstPosition = 0;
        const lastPosition = foldersList.length - 1;
        const newlySelectedFolder = _.last(selectedFolders) || '';
        const newlySelectedPosition = foldersList.findIndex(
          folder => folder === newlySelectedFolder
        );
        const previousFolder = foldersList[newlySelectedPosition - 1];
        const nextFolder = foldersList[newlySelectedPosition + 1];

        switch (event.key) {
          case 'ArrowLeft':
            if (newlySelectedPosition === firstPosition) return;
            if (isHoldingShift) {
              const isGoingBackward = selectedFolders.includes(previousFolder);
              const newSelectedFolders = isGoingBackward
                ? selectedFolders.filter(f => f !== newlySelectedFolder)
                : [...selectedFolders, previousFolder];
              updateSelectedFolders(newSelectedFolders);
            } else {
              updateSelectedFolders([previousFolder]);
            }
            break;
          case 'ArrowRight':
            if (newlySelectedPosition === lastPosition) return;
            if (isHoldingShift) {
              const isGoingBackward = selectedFolders.includes(nextFolder);
              const newSelectedFolders = isGoingBackward
                ? selectedFolders.filter(f => f !== newlySelectedFolder)
                : [...selectedFolders, nextFolder];
              updateSelectedFolders(newSelectedFolders);
            } else {
              updateSelectedFolders([nextFolder]);
            }
            break;
          case 'ArrowDown':
            break;
          case 'ArrowUp':
            break;
        }
        event.preventDefault();
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
  useEffect(() => {
    foldersListRef.current = foldersList;
  }, [foldersList]);

  const updateParams = (newParams: FolderFilterParams): void => {
    setParams({ ...params, ...newParams });
  };
  const updateSelectedFolders = (newSelectedFolders: Array<string>): void => {
    const foldersList = foldersListRef.current.map(folder => folder.location);
    const scrollToNewlySelectedFolder = () => {
      const selectedFolderJustNow = _.last(newSelectedFolders);
      const selectedFolderJustNowIndex = foldersList.findIndex(
        folder => folder === selectedFolderJustNow
      );
      const selectedFolderJustNowElement = document.getElementById(
        ELEMENT_ID.FOLDER_CARD(selectedFolderJustNowIndex)
      );
      selectedFolderJustNowElement?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
    };

    dispatch({
      type: SELECT_FOLDERS,
      payload: { selectedFolders: newSelectedFolders }
    });
    scrollToNewlySelectedFolder();
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
        <Body updateSelectedFolders={updateSelectedFolders} />
        <Footer updateParams={updateParams} />
      </section>
      <FolderDialog onClose={onCloseFolderDialog} {...folderDialogParams} />
    </>
  );
};

export default FoldersDisplay;
