import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Overlay, Spinner, Intent } from '@blueprintjs/core';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { FolderCard } from '../../components/commonComponents';
import './body.styled.scss';

const Body = (): ReactElement => {
  const { isLoading } = useSelector((state: RootState) => state.status);
  const { foldersList } = useSelector((state: RootState) => state.folder);

  const renderFolders = (): Array<ReactElement> => {
    return foldersList.map(folder => {
      return (
        <FolderCard
          folderName={folder.name || ''}
          thumbnailLocation={folder.thumbnail}
        />
      );
    });
  };

  return (
    <section className="main-body_container">
      {renderFolders()}
      <Overlay
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={isLoading}
      >
        <section className="main-body_loading-container">
          <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE} />
        </section>
      </Overlay>
    </section>
  );
};

export default Body;
