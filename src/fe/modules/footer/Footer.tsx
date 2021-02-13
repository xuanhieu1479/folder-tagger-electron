import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';
import { RootState } from '../../../common/interfaces/feInterfaces';
import { Pagination } from '../../components/commonComponents';
import './Footer.styled.scss';

interface Footer {
  params: FolderFilterParams;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
}

const Footer = ({ params, updateParams }: Footer): ReactElement => {
  const { totalFolders } = useSelector((state: RootState) => state.folder);

  return (
    <footer className="footer_container">
      <Pagination
        currentPage={params.currentPage || PAGINATION.DEFAULT.currentPage}
        itemsPerPage={params.itemsPerPage || PAGINATION.DEFAULT.itemsPerPage}
        updateParams={updateParams}
        totalFolders={totalFolders}
      />
    </footer>
  );
};

export default Footer;
