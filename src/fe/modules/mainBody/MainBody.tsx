import React, { ReactElement, useState, useEffect } from 'react';
import { folder } from '../../../common/interfaces/folderInterfaces';
import { FolderCard } from '../../components/commonComponents';
import { getFolders } from '../../actions/folder';
import './mainBody.styled.scss';

const MainBody = (): ReactElement => {
  const [folders, setFolders] = useState<Array<folder>>([]);

  useEffect((): void => {
    const getNewFolders = async () => {
      const newFolders = await getFolders();
      setFolders(newFolders);
    };

    getNewFolders();
  }, []);

  const renderFolders = (): Array<ReactElement> => {
    return folders.map(folder => {
      return (
        <FolderCard
          folderName={folder.name || ''}
          thumbnailLocation={folder.thumbnail}
        />
      );
    });
  };

  return <section className="main-body_container">{renderFolders()}</section>;
};

export default MainBody;
