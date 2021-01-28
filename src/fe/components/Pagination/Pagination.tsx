import React, { ReactElement } from 'react';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import TotalPages from './TotalPages';
import PaginationButtonsGroup from './PaginationButtonsGroup';
import PaginationOptions from './PaginationOptions';
import './Pagination.styled.scss';

interface PaginationInterface {
  totalFolders: number;
  pagesRangeDisplayed?: number;
  currentPage: number;
  itemsPerPage: number;
  updateParams: (newParams: FolderFilterParams) => void;
}

const Pagination = ({
  totalFolders,
  pagesRangeDisplayed,
  currentPage,
  itemsPerPage,
  updateParams
}: PaginationInterface): ReactElement => {
  const totalPages = Math.ceil(totalFolders / itemsPerPage);

  return (
    <section className="footer_pagination_container">
      <TotalPages totalFolders={totalFolders} />
      {totalPages > 1 ? (
        <PaginationButtonsGroup
          totalPages={totalPages}
          pagesRangeDisplayed={pagesRangeDisplayed}
          currentPage={currentPage}
          updateParams={updateParams}
        />
      ) : null}
      <PaginationOptions
        itemsPerPage={itemsPerPage}
        updateParams={updateParams}
      />
    </section>
  );
};

export default Pagination;
