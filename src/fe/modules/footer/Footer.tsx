import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';
import { Pagination } from '../../components/commonComponents';
import './footer.styled.scss';

interface FooterInterface {
  updateParams: (newParams: FolderFilterParams) => void;
}

const Footer = ({ updateParams }: FooterInterface): ReactElement => {
  const { totalFolders } = useSelector((state: RootState) => state.folder);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    PAGINATION.ITEMS_PER_PAGE[0]
  );

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      updateParams({ currentPage, itemsPerPage });
    }
  }, [currentPage, itemsPerPage]);

  return (
    <footer className="footer-container">
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalFolders={totalFolders}
      />
    </footer>
  );
};

export default Footer;
