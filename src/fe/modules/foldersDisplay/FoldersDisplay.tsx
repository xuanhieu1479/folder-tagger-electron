import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import {
  PAGINATION,
  ELEMENT_ID,
  MESSAGE
} from '../../../common/variables/commonVariables';
import { TagAction } from '../../../common/enums/commonEnums';
import FunctionsContext from '../../context/FunctionsContext';
import {
  FolderDialog,
  ClipboardDialog
} from '../../components/commonComponents';
import Header from '../header/Header';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { onOpenDialog, onCloseDialog } from '../../redux/status/statusAction';
import { SELECT_FOLDERS } from '../../redux/folder/folderActionType';
import { getFolders } from '../../redux/folder/folderAction';
import { getTags } from '../../redux/tag/tagAction';
import {
  showMessage,
  openDirectory,
  runExternalProgram,
  generateTagsFromSearchKeywords
} from '../../../utilities/feUtilities';
import './FoldersDisplay.styled.scss';

interface FolderDisplay {
  openSettingDialog: () => void;
}
const defaultFolderDialogParams = {
  isOpen: false,
  dialogType: TagAction.Add
};

const FoldersDisplay = ({ openSettingDialog }: FolderDisplay): ReactElement => {
  const dispatch = useDispatch();
  const { selectedFolders, foldersList, categories, languages } = useSelector(
    (state: RootState) => state.folder
  );
  const { isDialogOpen } = useSelector((state: RootState) => state.status);
  const { defaultValue, shortcut } = useSelector(
    (state: RootState) => state.setting
  );
  const selectedFoldersRef = useRef(selectedFolders);
  const foldersListRef = useRef(foldersList);
  const isDialogOpenRef = useRef(isDialogOpen);
  const shortcutRef = useRef(shortcut);
  const [params, setParams] = useState(PAGINATION.DEFAULT);
  const [folderDialogParams, setFolderDialogParams] = useState({
    ...defaultFolderDialogParams
  });
  const [isClipboardDialogOpen, setClipboardDialogOpen] = useState(false);
  const [isFirstRender, setFirstRender] = useState(true);

  useEffect(() => {
    const keyDownListerner = async (event: KeyboardEvent) => {
      const isDialogOpen = isDialogOpenRef.current;
      const selectedFolders = selectedFoldersRef.current;
      const shortcut = shortcutRef.current;
      const foldersList = foldersListRef.current.map(folder => folder.location);
      const isHoldingCtrl = event.ctrlKey;

      if (isHoldingCtrl) {
        if (isDialogOpen) return;
        switch (event.key) {
          case shortcut.addTagsToFolder:
            onOpenFolderDialog(TagAction.Add);
            break;
          case shortcut.editTagsOfFolder:
            onOpenFolderDialog(TagAction.Edit);
            break;
          case shortcut.removeTagsFromFolder:
            onOpenFolderDialog(TagAction.Remove);
            break;
          case 't':
            openSettingDialog();
            break;
          case 'c':
            onOpenClipboardDialog();
            break;
          case shortcut.openFolderInExplorer:
            onOpenFolderInExplorer();
            break;
          case shortcut.openFolderInExternalProgram:
            onOpenFolderInExternalProgram();
            break;
          case shortcut.focusSearchInput:
            onFocusSearchInput();
            break;
        }
      } else {
        if (foldersList.length < 1) return;
        const folderCardElements = document
          .getElementById(ELEMENT_ID.FOLDER_CARD_CONTAINER)
          ?.querySelectorAll(`[id^=${ELEMENT_ID.FOLDER_CARD('')}]`);
        const folderCardsOffsetTop: number[] = [];
        if (folderCardElements)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          folderCardElements.forEach((element: any) =>
            folderCardsOffsetTop.push(element.offsetTop)
          );

        const isHoldingShift = event.shiftKey;
        const hasNoSelectedFolder = selectedFolders.length === 0;
        const firstPosition = 0;
        const lastPosition = foldersList.length - 1;
        const newlySelectedFolder = _.last(selectedFolders);
        const newlySelectedPosition = foldersList.findIndex(
          folder => folder === newlySelectedFolder
        );

        const foldersPerRow = folderCardsOffsetTop.filter(
          i => i === folderCardsOffsetTop[0]
        ).length;
        const upPosition = newlySelectedPosition - foldersPerRow;
        const downPosition = newlySelectedPosition + foldersPerRow;
        const selectedFolderIsAtTheStart =
          newlySelectedPosition === firstPosition;
        const selectedFolderIsAtTheEnd = newlySelectedPosition === lastPosition;
        const selectedFolderIsAtTheTopRow = upPosition < firstPosition;
        const selectedFolderIsAtTheBottomRow = downPosition > lastPosition;

        const firstFolder = foldersList[firstPosition];
        const lastFolder = foldersList[lastPosition];
        const previousFolder = selectedFolderIsAtTheStart
          ? lastFolder
          : foldersList[newlySelectedPosition - 1];
        const nextFolder = selectedFolderIsAtTheEnd
          ? firstFolder
          : foldersList[newlySelectedPosition + 1];

        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            if (isDialogOpen) return;
            if (hasNoSelectedFolder) updateSelectedFolders([lastFolder]);
            else if (isHoldingShift) {
              if (selectedFolderIsAtTheStart) return;
              const isGoingBackward = selectedFolders.includes(previousFolder);
              const newSelectedFolders = isGoingBackward
                ? selectedFolders.filter(f => f !== newlySelectedFolder)
                : [...selectedFolders, previousFolder];
              updateSelectedFolders(newSelectedFolders);
            } else updateSelectedFolders([previousFolder]);
            break;
          case 'ArrowRight':
            event.preventDefault();
            if (isDialogOpen) return;
            if (hasNoSelectedFolder) updateSelectedFolders([firstFolder]);
            else if (isHoldingShift) {
              if (selectedFolderIsAtTheEnd) return;
              const isGoingBackward = selectedFolders.includes(nextFolder);
              const newSelectedFolders = isGoingBackward
                ? selectedFolders.filter(f => f !== newlySelectedFolder)
                : [...selectedFolders, nextFolder];
              updateSelectedFolders(newSelectedFolders);
            } else updateSelectedFolders([nextFolder]);
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (isDialogOpen || selectedFolderIsAtTheTopRow) return;
            if (hasNoSelectedFolder) updateSelectedFolders([lastFolder]);
            else updateSelectedFolders([foldersList[upPosition]]);
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (isDialogOpen || selectedFolderIsAtTheBottomRow) return;
            if (hasNoSelectedFolder) updateSelectedFolders([firstFolder]);
            else updateSelectedFolders([foldersList[downPosition]]);
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

    const { defaultSearchParams, isSearchRandomly } = defaultValue;
    const isRandom = isSearchRandomly.toLowerCase() === 'yes';
    if ((!defaultSearchParams && !isRandom) || !isFirstRender) getNewFolders();
    else {
      const initialSearchParams = generateTagsFromSearchKeywords(
        defaultSearchParams
      );
      getFolders(dispatch, {
        ...params,
        tags: initialSearchParams,
        isRandom
      });
      setFirstRender(false);
    }
  }, [params]);

  useEffect(() => {
    selectedFoldersRef.current = selectedFolders;
    foldersListRef.current = foldersList;
    isDialogOpenRef.current = isDialogOpen;
    shortcutRef.current = shortcut;
  }, [selectedFolders, foldersList, isDialogOpen, shortcut]);

  useEffect(() => {
    if (!folderDialogParams.isOpen) getTags(dispatch);
  }, [folderDialogParams.isOpen]);

  const updateParams = (newParams: Partial<FolderFilterParams>): void => {
    setParams({ ...params, ...newParams });
  };
  const updateSelectedFolders = (newSelectedFolders: string[]): void => {
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

  const onOpenFolderDialog = (dialogType: TagAction) => {
    const selectedFolders = selectedFoldersRef.current;
    const atLeastOneFolderIsBeingSelected = selectedFolders.length > 0;
    const hasExactlyOneSelectedFolder = selectedFolders.length === 1;
    const hasSeveralSelectedFolders = selectedFolders.length > 1;
    const openFolderDialog = () => {
      onOpenDialog(dispatch);
      setFolderDialogParams({ isOpen: true, dialogType });
    };

    switch (dialogType) {
      case TagAction.Add:
      case TagAction.Remove:
        if (atLeastOneFolderIsBeingSelected) openFolderDialog();
        break;
      case TagAction.Edit:
        if (hasSeveralSelectedFolders)
          showMessage.error(MESSAGE.CANNOT_EDIT_MANY_FOLDERS);
        if (hasExactlyOneSelectedFolder) openFolderDialog();
        break;
    }
  };
  const onCloseFolderDialog = () => {
    onCloseDialog(dispatch);
    setFolderDialogParams({ ...defaultFolderDialogParams });
  };

  const onOpenClipboardDialog = () => {
    const selectedFolders = selectedFoldersRef.current;
    if (selectedFolders.length > 1)
      showMessage.error(MESSAGE.CANNOT_COPY_TAG_MANY_FOLDERS);
    else if (selectedFolders.length === 1) {
      onOpenDialog(dispatch);
      setClipboardDialogOpen(true);
    }
  };
  const onCloseClipboardDialog = () => {
    setClipboardDialogOpen(false);
    onCloseDialog(dispatch);
  };

  const onOpenFolderInExplorer = () => {
    const selectedFolders = selectedFoldersRef.current;
    if (selectedFolders.length === 1) openDirectory(selectedFolders[0]);
  };
  const onOpenFolderInExternalProgram = () => {
    const selectedFolders = selectedFoldersRef.current;
    const externalProgramPath = shortcutRef.current.defaultExternalProgram;
    if (!externalProgramPath)
      showMessage.info(MESSAGE.EXTERNAL_PROGRAM_UNAVAILABLE);
    else if (selectedFolders.length === 1)
      runExternalProgram(externalProgramPath, [selectedFolders[0]]);
  };

  const onFocusSearchInput = () => {
    const inputElement = document.getElementById(ELEMENT_ID.SEARCH_INPUT);
    inputElement?.focus();
  };

  return (
    <FunctionsContext.Provider
      value={{
        dialog: {
          onOpenFolderDialog,
          onOpenClipboardDialog
        },
        directory: {
          onOpenFolderInExplorer,
          onOpenFolderInExternalProgram
        }
      }}
    >
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
      <FolderDialog
        onClose={onCloseFolderDialog}
        isOpen={folderDialogParams.isOpen}
        dialogType={folderDialogParams.dialogType}
      />
      <ClipboardDialog
        isOpen={isClipboardDialogOpen}
        onClose={onCloseClipboardDialog}
      />
    </FunctionsContext.Provider>
  );
};

export default FoldersDisplay;
