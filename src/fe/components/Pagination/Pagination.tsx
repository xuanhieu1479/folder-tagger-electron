import React, { ReactElement } from 'react';
import TotalPages from './TotalPages';
import PagePagination from './PagePagination';
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
  return (
    <section className="footer_pagination-container">
      <TotalPages totalFolders={totalFolders} />
      {totalFolders > 0 ? (
        <PagePagination
          totalPages={Math.ceil(totalFolders / itemsPerPage)}
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
