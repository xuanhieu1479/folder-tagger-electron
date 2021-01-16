import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Overlay, Spinner, Intent } from '@blueprintjs/core';
import { folder } from '../../../common/interfaces/folderInterfaces';
import { rootState } from '../../../common/interfaces/feInterfaces';
import { FolderCard } from '../../components/commonComponents';
import { getFolders } from '../../actions/folder';
import {
  START_LOADING,
  FINISH_LOADING
} from '../../redux/status/statusActionType';
import './mainBody.styled.scss';

const MainBody = (): ReactElement => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: rootState) => state.status);
  const [folders, setFolders] = useState<Array<folder>>([]);

  useEffect((): void => {
    const getNewFolders = async () => {
      dispatch({ type: START_LOADING });
      const newFolders = await getFolders();
      setFolders(newFolders);
      dispatch({ type: FINISH_LOADING });
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

export default MainBody;
