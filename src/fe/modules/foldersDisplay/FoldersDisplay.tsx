import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { ELEMENT_ID, MESSAGE } from '../../../common/variables/commonVariables';
import { TagAction } from '../../../common/enums/commonEnums';
import FunctionsContext from '../../context/FunctionsContext';
import {
  FolderDialog,
  ClipboardDialog,
  RenameOmnibar
} from '../../components/commonComponents';
import Header from '../header/Header';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { onOpenDialog, onCloseDialog } from '../../redux/status/statusAction';
import { SELECT_FOLDERS } from '../../redux/folder/folderActionType';
import { removeFolders } from '../../redux/folder/folderAction';
import { getTags } from '../../redux/tag/tagAction';
import {
  showMessage,
  openDirectory,
  runExternalProgram
} from '../../../utilities/feUtilities';
import './FoldersDisplay.styled.scss';

interface FolderDisplay {
  params: FolderFilterParams;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
  searchKeywords: string;
  onChangeSearchKeywords: (event: React.FormEvent<HTMLInputElement>) => void;
  openSettingDialog: () => void;
}
const defaultFolderDialogParams = {
  isOpen: false,
  dialogType: TagAction.Add
};

const FoldersDisplay = ({
  params,
  updateParams,
  searchKeywords,
  onChangeSearchKeywords,
  openSettingDialog
}: FolderDisplay): ReactElement => {
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
  const defaultValueRef = useRef(defaultValue);
  const [folderDialogParams, setFolderDialogParams] = useState({
    ...defaultFolderDialogParams
  });
  const [isClipboardDialogOpen, setClipboardDialogOpen] = useState(false);
  const [renameOmnibarParams, setRenameOmnibarParams] = useState({
    isOpen: false,
    folderName: ''
  });

  useEffect(() => {
    const keyDownListerner = async (event: KeyboardEvent) => {
      const isDialogOpen = isDialogOpenRef.current;
      const selectedFolders = selectedFoldersRef.current;
      const shortcut = shortcutRef.current;
      const foldersList = foldersListRef.current.map(folder => folder.location);
      const isHoldingCtrl = event.ctrlKey;
      const { activeElement } = document;
      const isSelectingCategoryOrLanguage =
        activeElement?.id === ELEMENT_ID.HEADER_CATEGORY_SELECT ||
        activeElement?.id === ELEMENT_ID.HEADER_LANGUAGE_SELECT;
      const isTypingSearchKeywords =
        activeElement?.id === ELEMENT_ID.HEADER_SEARCH_INPUT;

      if (isHoldingCtrl) {
        if (isDialogOpen) return;
        switch (event.key) {
          case shortcut.openFolderInExternalProgram:
            onOpenFolderInExternalProgram();
            break;
          case shortcut.openFolderInExplorer:
            onOpenFolderInExplorer();
            break;
          case shortcut.addTagsToFolder:
            onOpenFolderDialog(TagAction.Add);
            break;
          case shortcut.editTagsOfFolder:
            onOpenFolderDialog(TagAction.Edit);
            break;
          case shortcut.removeTagsFromFolder:
            onOpenFolderDialog(TagAction.Remove);
            break;
          case shortcut.renameFolder:
            onOpenRenameOmnibar();
            break;
          case 't':
            openSettingDialog();
            break;
          case 'c':
            onOpenClipboardDialog();
            break;
          case shortcut.focusSearchInput:
            onFocusSearchInput();
            break;
          case 'a':
            if (isSelectingCategoryOrLanguage || isTypingSearchKeywords) return;
            event.preventDefault();
            onSelectAllFolders(foldersList);
            break;
        }
      } else {
        if (
          foldersList.length < 1 ||
          isSelectingCategoryOrLanguage ||
          (isTypingSearchKeywords &&
            (event.key === 'ArrowLeft' || event.key === 'ArrowRight'))
        )
          return;
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
          !hasNoSelectedFolder && newlySelectedPosition === firstPosition;
        const selectedFolderIsAtTheEnd =
          !hasNoSelectedFolder && newlySelectedPosition === lastPosition;
        const selectedFolderIsAtTheTopRow =
          !hasNoSelectedFolder && upPosition < firstPosition;
        const selectedFolderIsAtTheBottomRow =
          !hasNoSelectedFolder && downPosition > lastPosition;

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
            if (isDialogOpen) return;
            event.preventDefault();
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
            if (isDialogOpen) return;
            event.preventDefault();
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
            if (isTypingSearchKeywords && activeElement instanceof HTMLElement)
              activeElement.blur();
            if (hasNoSelectedFolder || isTypingSearchKeywords)
              updateSelectedFolders([lastFolder]);
            else updateSelectedFolders([foldersList[upPosition]]);
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (isDialogOpen || selectedFolderIsAtTheBottomRow) return;
            if (isTypingSearchKeywords && activeElement instanceof HTMLElement)
              activeElement.blur();
            if (hasNoSelectedFolder || isTypingSearchKeywords)
              updateSelectedFolders([firstFolder]);
            else updateSelectedFolders([foldersList[downPosition]]);
            break;
        }
      }
    };

    window.addEventListener('keydown', keyDownListerner);
    return () => window.removeEventListener('keydown', keyDownListerner);
  }, []);

  useEffect(() => {
    selectedFoldersRef.current = selectedFolders;
    foldersListRef.current = foldersList;
    isDialogOpenRef.current = isDialogOpen;
    shortcutRef.current = shortcut;
    defaultValueRef.current = defaultValue;
  }, [selectedFolders, foldersList, isDialogOpen, shortcut, defaultValue]);

  useEffect(() => {
    if (!folderDialogParams.isOpen) getTags(dispatch);
  }, [folderDialogParams.isOpen]);

  const updateSelectedFolders = (
    newSelectedFolders: string[],
    scrollToFolder = true
  ): void => {
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
    if (scrollToFolder) scrollToNewlySelectedFolder();
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

  const onOpenRenameOmnibar = () => {
    const selectedFolders = selectedFoldersRef.current;
    if (selectedFolders.length === 1) {
      const selectedFolder = selectedFolders[0];
      onOpenDialog(dispatch);
      setRenameOmnibarParams({
        isOpen: true,
        folderName: selectedFolder
      });
    } else if (selectedFolders.length > 1)
      showMessage.error(MESSAGE.CANNOT_RENAME_MANY_FOLDERS);
  };
  const onCloseRenameOmnibar = () => {
    setRenameOmnibarParams({ isOpen: false, folderName: '' });
    onCloseDialog(dispatch);
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

  const onOpenFolderInExternalProgram = () => {
    const selectedFolders = selectedFoldersRef.current;
    const externalProgramPath = defaultValueRef.current.defaultExternalProgram;
    if (!externalProgramPath)
      showMessage.info(MESSAGE.EXTERNAL_PROGRAM_UNAVAILABLE);
    else if (selectedFolders.length === 1)
      runExternalProgram(externalProgramPath, [selectedFolders[0]]);
  };
  const onOpenFolderInExplorer = () => {
    const selectedFolders = selectedFoldersRef.current;
    if (selectedFolders.length === 1) openDirectory(selectedFolders[0]);
  };
  const onRemoveFolders = () => {
    const selectedFolders = selectedFoldersRef.current;
    removeFolders(dispatch, selectedFolders);
  };

  const onFocusSearchInput = () => {
    const inputElement = document.getElementById(
      ELEMENT_ID.HEADER_SEARCH_INPUT
    );
    if (inputElement) {
      inputElement.focus();
      updateSelectedFolders([]);
    }
  };

  const onSelectAllFolders = (foldersList: string[]) =>
    updateSelectedFolders(foldersList, false);

  return (
    <FunctionsContext.Provider
      value={{
        dialog: {
          onOpenFolderDialog,
          onOpenClipboardDialog,
          onOpenRenameOmnibar
        },
        directory: {
          onOpenFolderInExplorer,
          onOpenFolderInExternalProgram,
          onRemoveFolders
        }
      }}
    >
      <section className="folder-display_container">
        <Header
          params={params}
          updateParams={updateParams}
          searchKeywords={searchKeywords}
          onChangeSearchKeywords={onChangeSearchKeywords}
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
      <RenameOmnibar {...renameOmnibarParams} onClose={onCloseRenameOmnibar} />
    </FunctionsContext.Provider>
  );
};

export default FoldersDisplay;
