import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Overlay, Spinner, Intent } from '@blueprintjs/core';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { ELEMENT_ID } from '../../../common/variables/commonVariables';
import { FolderCard } from '../../components/commonComponents';
import './Body.styled.scss';

interface BodyInterface {
  updateSelectedFolders: (newSelectedFolders: Array<string>) => void;
}

const Body = ({ updateSelectedFolders }: BodyInterface): ReactElement => {
  const { isLoading } = useSelector((state: RootState) => state.status);
  const { foldersList, selectedFolders } = useSelector(
    (state: RootState) => state.folder
  );

  useEffect(() => {
    const clearSelectedFolders = (event: MouseEvent) => {
      const isClickingFolderCard = event
        .composedPath()
        // element is supposed to be HTMLElement not EventTarget
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .some((element: any): boolean =>
          RegExp(/folder-card-\d/).test(element?.id)
        );
      if (!isClickingFolderCard) {
        updateSelectedFolders([]);
      }
    };

    const rootElement = document.getElementById('root');
    rootElement?.addEventListener('click', clearSelectedFolders);
    return () =>
      rootElement?.removeEventListener('click', clearSelectedFolders);
  }, []);

  const onSelectFolder = (
    event: React.MouseEvent,
    folderLocation: string
  ): void => {
    const isHoldingShift = event.shiftKey;
    const isHoldingCtrl = event.ctrlKey;
    const isSelectingSameFolder = folderLocation === selectedFolders[0];
    const selectedFoldersCount = selectedFolders.length;

    if (!isHoldingShift) {
      if (isHoldingCtrl) {
        // Holding ctrl while clicking
        if (selectedFolders.includes(folderLocation))
          updateSelectedFolders(
            selectedFolders.filter(
              selectedFolder => selectedFolder !== folderLocation
            )
          );
        else updateSelectedFolders([...selectedFolders, folderLocation]);
        return;
      }
      // Normal click, no holding shift nor ctrl
      if (isSelectingSameFolder && selectedFoldersCount === 1)
        updateSelectedFolders([]);
      else updateSelectedFolders([folderLocation]);
    } else {
      // Holding shift while clicking, regardless of holding ctrl or not
      if (selectedFoldersCount === 0) updateSelectedFolders([folderLocation]);
      else if (isSelectingSameFolder) updateSelectedFolders([folderLocation]);
      else {
        const folderLocationsList = foldersList.map(f => f.location);
        const fromPosition = folderLocationsList.findIndex(
          fl => fl === selectedFolders[0]
        );
        const toPosition = folderLocationsList.findIndex(
          fl => fl === folderLocation
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

  const renderFolders = (): Array<ReactElement> => {
    return foldersList.map((folder, index) => {
      return (
        <FolderCard
          id={ELEMENT_ID.FOLDER_CARD(index)}
          folderLocation={folder.location}
          folderName={folder.name || ''}
          thumbnailLocation={folder.thumbnail}
          onClick={onSelectFolder}
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
