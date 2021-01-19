import React, { ReactElement } from 'react';
import TotalPages from './TotalPages';
import PaginationButtonsGroup from './PaginationButtonsGroup';
import PaginationOptions from './PaginationOptions';
import '.././styles/Pagination.styled.scss';

interface PaginationInterface {
  totalFolders: number;
  pagesRangeDisplayed?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (quantity: number) => void;
}

const Pagination = ({
  totalFolders,
  pagesRangeDisplayed,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage
}: PaginationInterface): ReactElement => {
  const totalPages = Math.ceil(totalFolders / itemsPerPage);

  return (
    <section className="footer_pagination-container">
      <TotalPages totalFolders={totalFolders} />
      {totalPages > 1 ? (
        <PaginationButtonsGroup
          totalPages={totalPages}
          pagesRangeDisplayed={pagesRangeDisplayed}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
      <PaginationOptions
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
};

export default Pagination;
