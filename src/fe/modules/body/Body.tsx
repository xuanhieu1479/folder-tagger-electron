import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Overlay, Spinner, Intent } from '@blueprintjs/core';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { ELEMENT_ID } from '../../../common/variables/commonVariables';
import { FolderCard } from '../../components/commonComponents';
import './Body.styled.scss';

interface Body {
  updateSelectedFolders: (newSelectedFolders: string[]) => void;
}

const Body = ({ updateSelectedFolders }: Body): ReactElement => {
  const { isLoading } = useSelector((state: RootState) => state.status);
  const { foldersList, selectedFolders } = useSelector(
    (state: RootState) => state.folder
  );

  const clearSelectedFolders = () => {
    updateSelectedFolders([]);
  };
  const selectOnlyOneFolder = (folderLocation: string) => {
    updateSelectedFolders([folderLocation]);
  };
  const addFolderToSelectedList = (folderLocation: string) => {
    updateSelectedFolders([...selectedFolders, folderLocation]);
  };

  useEffect(() => {
    const onClickListerner = (event: MouseEvent) => {
      const isClickingFolderCard = event
        .composedPath()
        // element is supposed to be HTMLElement not EventTarget
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .some((element: any): boolean =>
          RegExp(/folder-card-\d/).test(element?.id)
        );
      if (!isClickingFolderCard) clearSelectedFolders();
    };

    const rootElement = document.getElementById('root');
    rootElement?.addEventListener('click', onClickListerner);
    return () => rootElement?.removeEventListener('click', onClickListerner);
  }, []);

  const onSelectFolder = (
    event: React.MouseEvent,
    clickedFolder: string
  ): void => {
    const isHoldingShift = event.shiftKey;
    const isHoldingCtrl = event.ctrlKey;
    const clickedFirstSelectedFolders = clickedFolder === selectedFolders[0];
    const selectedFoldersCount = selectedFolders.length;
    const clickedOneOfSelectedFolders = selectedFolders.includes(clickedFolder);
    const deselectFolder =
      clickedFirstSelectedFolders && selectedFoldersCount === 1;
    const noFolderIsBeingSelected = selectedFoldersCount === 0;

    if (!isHoldingShift) {
      if (isHoldingCtrl) {
        // Holding ctrl while clicking
        if (clickedOneOfSelectedFolders)
          updateSelectedFolders(
            selectedFolders.filter(
              selectedFolder => selectedFolder !== clickedFolder
            )
          );
        else addFolderToSelectedList(clickedFolder);
        return;
      }
      // Normal click, no holding shift nor ctrl
      if (deselectFolder) clearSelectedFolders();
      else selectOnlyOneFolder(clickedFolder);
    } else {
      // Holding shift while clicking, regardless of holding ctrl or not
      if (noFolderIsBeingSelected || clickedFirstSelectedFolders)
        selectOnlyOneFolder(clickedFolder);
      else {
        const folderLocationsList = foldersList.map(f => f.location);
        const fromPosition = folderLocationsList.findIndex(
          fl => fl === selectedFolders[0]
        );
        const toPosition = folderLocationsList.findIndex(
          fl => fl === clickedFolder
        );
        if (fromPosition < toPosition)
          updateSelectedFolders(
            folderLocationsList.slice(fromPosition, toPosition + 1)
          );
        else if (fromPosition > toPosition)
          updateSelectedFolders(
            folderLocationsList.slice(toPosition, fromPosition + 1).reverse()
          );
      }
    }
  };

  const renderFolders = (): ReactElement[] => {
    return foldersList.map((folder, index) => {
      return (
        <FolderCard
          id={ELEMENT_ID.FOLDER_CARD(index)}
          folderLocation={folder.location}
          folderName={folder.name || ''}
          thumbnailLocation={folder.thumbnail}
          onClick={onSelectFolder}
          addToSelectedList={selectOnlyOneFolder}
          isBeingSelected={selectedFolders.includes(folder.location)}
        />
      );
    });
  };

  return (
    <section id={ELEMENT_ID.FOLDER_CARD_CONTAINER} className="body_container">
      {renderFolders()}
      <Overlay
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={isLoading}
      >
        <section className="body_container_loading_container">
          <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE} />
        </section>
      </Overlay>
    </section>
  );
};

export default Body;
