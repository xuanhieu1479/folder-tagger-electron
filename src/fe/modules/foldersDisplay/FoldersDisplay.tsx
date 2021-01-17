import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { getFolders } from '../../actions/folder';
import { UPDATE_FOLDERS } from '../../redux/folder/folderActionType';
import './foldersDisplay.styled.scss';

const FoldersDisplay = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect((): void => {
    const getNewFolders = async () => {
      const newFolders = await getFolders(dispatch);
      dispatch({
        type: UPDATE_FOLDERS,
        payload: {
          foldersList: newFolders,
          totalFolders: newFolders.length
        }
      });
    };

    getNewFolders();
  }, []);

  return (
    <section className="folder-display-container">
      <Body />
      <Footer />
    </section>
  );
};

export default FoldersDisplay;
