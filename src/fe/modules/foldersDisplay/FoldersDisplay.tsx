import React, { ReactElement, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FolderFilterParams } from '../../../common/interfaces/folderInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';
import Body from '../body/Body';
import Footer from '../footer/Footer';
import { getFolders } from '../../redux/folder/folderAction';
import './foldersDisplay.styled.scss';

const defaultParams = {
  currentPage: 1,
  itemsPerPage: PAGINATION.ITEMS_PER_PAGE[0]
};

const FoldersDisplay = (): ReactElement => {
  const dispatch = useDispatch();
  const [params, setParams] = useState(defaultParams);

  const updateParams = (newParams: FolderFilterParams): void => {
    setParams({ ...params, ...newParams });
  };

  useEffect((): void => {
    const getNewFolders = async () => {
      await getFolders(dispatch, params);
    };

    getNewFolders();
  }, [params]);

  return (
    <section className="folder-display-container">
      <Body />
      <Footer updateParams={updateParams} />
    </section>
  );
};

export default FoldersDisplay;
