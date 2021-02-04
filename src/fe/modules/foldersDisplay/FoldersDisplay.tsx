import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import {
  PAGINATION,
  TAG_ACTION,
  ELEMENT_ID,
  MESSAGE
} from '../../../common/variables/commonVariables';
import { FolderDialog } from '../../components/commonComponents';
import Header from '../header/Header';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { onOpenDialog, onCloseDialog } from '../../redux/status/statusAction';
import { SELECT_FOLDERS } from '../../redux/folder/folderActionType';
import { getFolders } from '../../redux/folder/folderAction';
import { showMessage } from '../../../utilities/utilityFunctions';
import './FoldersDisplay.styled.scss';

interface FoldersDisplayInterface {
  openSettingDialog: () => void;
}
const defaultFolderDialogParams = {
  isOpen: false,
  dialogType: TAG_ACTION.ADD
};

const FoldersDisplay = ({
  openSettingDialog
}: FoldersDisplayInterface): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders, foldersList, categories, languages } = useSelector(
    (state: RootState) => state.folder
  );
  const { isDialogOpen } = useSelector((state: RootState) => state.status);
  const selectedFoldersRef = useRef(selectedFolders);
  const foldersListRef = useRef(foldersList);
  const isDialogOpenRef = useRef(isDialogOpen);
  const [params, setParams] = useState(PAGINATION.DEFAULT);
  const [folderDialogParams, setFolderDialogParams] = useState(
    defaultFolderDialogParams
  );

  useEffect(() => {
    const keyDownListerner = (event: KeyboardEvent) => {
      const isDialogOpen = isDialogOpenRef.current;
      const selectedFolders = selectedFoldersRef.current;
      const foldersList = foldersListRef.current.map(folder => folder.location);

      if (event.ctrlKey) {
        if (isDialogOpen) return;
        switch (event.key) {
          case 'e':
            if (!_.isEmpty(selectedFolders)) onOpenFolderDialog(TAG_ACTION.ADD);
            break;
          case 's':
            if (selectedFolders.length === 0) return;
            if (selectedFolders.length > 1) {
              showMessage.error(MESSAGE.CANNOT_EDIT_MANY_FOLDERS);
              return;
            }
            if (selectedFolders.length === 1)
              onOpenFolderDialog(TAG_ACTION.EDIT);
            break;
          case 'd':
            if (!_.isEmpty(selectedFolders))
              onOpenFolderDialog(TAG_ACTION.REMOVE);
            break;
          case 't':
            openSettingDialog();
            break;
        }
      } else {
        if (_.isEmpty(selectedFolders) || foldersList.length <= 1) return;
        const folderCardElements = document
          .getElementById(ELEMENT_ID.FOLDER_CARD_CONTAINER)
          ?.querySelectorAll(`[id^=${ELEMENT_ID.FOLDER_CARD('')}]`);
        const folderCardsOffsetTop: Array<number> = [];
        if (folderCardElements)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          folderCardElements.forEach((element: any) =>
            folderCardsOffsetTop.push(element.offsetTop)
          );

        const isHoldingShift = event.shiftKey;
        const firstPosition = 0;
        const lastPosition = foldersList.length - 1;
        const newlySelectedFolder = _.last(selectedFolders);
        const newlySelectedPosition = foldersList.findIndex(
          folder => folder === newlySelectedFolder
        );
        const previousFolder = foldersList[newlySelectedPosition - 1];
        const nextFolder = foldersList[newlySelectedPosition + 1];
        const foldersPerRow = folderCardsOffsetTop.filter(
          i => i === folderCardsOffsetTop[0]
        ).length;
        const upPosition = newlySelectedPosition - foldersPerRow;
        const downPosition = newlySelectedPosition + foldersPerRow;

        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            if (isDialogOpen) return;
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
            event.preventDefault();
            if (isDialogOpen) return;
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
            event.preventDefault();
            if (isDialogOpen) return;
            if (downPosition > lastPosition) return;
            updateSelectedFolders([foldersList[downPosition]]);
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (isDialogOpen) return;
            if (upPosition < firstPosition) return;
            updateSelectedFolders([foldersList[upPosition]]);
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
      document
        .getElementById(ELEMENT_ID.FOLDER_CARD_CONTAINER)
        ?.scrollTo({ top: 0 });
    };

    getNewFolders();
  }, [params]);

  useEffect(() => {
    selectedFoldersRef.current = selectedFolders;
    foldersListRef.current = foldersList;
    isDialogOpenRef.current = isDialogOpen;
  }, [selectedFolders, foldersList, isDialogOpen]);

  const updateParams = (newParams: Partial<FolderFilterParams>): void => {
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
        behavior: 'smooth',
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

  const onOpenFolderDialog = (dialogType: string) => {
    setFolderDialogParams({ isOpen: true, dialogType });
    onOpenDialog(dispatch);
  };
  const onCloseFolderDialog = () => {
    setFolderDialogParams(defaultFolderDialogParams);
    onCloseDialog(dispatch);
  };

  return (
    <>
      <section className="folder-display_container">
        <Header
          params={params}
          updateParams={updateParams}
          allCategories={categories}
          allLanguages={languages}
        />
        <Body updateSelectedFolders={updateSelectedFolders} />
        <Footer params={params} updateParams={updateParams} />
      </section>
      <FolderDialog onClose={onCloseFolderDialog} {...folderDialogParams} />
    </>
  );
};

export default FoldersDisplay;
