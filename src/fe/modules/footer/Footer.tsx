import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';
import { Pagination } from '../../components/commonComponents';
import './footer.styled.scss';

const Footer = (): ReactElement => {
  const { totalFolders } = useSelector((state: RootState) => state.folder);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    PAGINATION.ITEMS_PER_PAGE[0]
  );

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
