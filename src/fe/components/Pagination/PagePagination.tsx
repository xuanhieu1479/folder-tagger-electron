import React, { ReactElement, useState, useEffect } from 'react';
import { ButtonGroup, Intent } from '@blueprintjs/core';
import { PAGINATION } from '../../../common/variables/commonVariables';
import PaginationButton from './PaginationButton';
import '.././styles/Pagination.styled.scss';

interface PagePaginationInterface {
  totalPages: number;
  pagesRangeDisplayed?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PagePagination = ({
  totalPages,
  pagesRangeDisplayed = PAGINATION.PAGES_RANGE_DISPLAYED,
  currentPage,
  setCurrentPage
}: PagePaginationInterface): ReactElement => {
  const [firstButtonInRange, setFirstButtonInRange] = useState(currentPage);

  useEffect(() => {
    // When current page goes out of range on the right side
    if (currentPage >= firstButtonInRange + pagesRangeDisplayed) {
      setFirstButtonInRange(currentPage - pagesRangeDisplayed + 1);
    }
    // When current page goes out of range on the left side
    if (currentPage < firstButtonInRange) {
      setFirstButtonInRange(currentPage);
    }
  }, [currentPage]);

  const renderPaginationButtons = (): ReactElement => {
    let startPosition = firstButtonInRange;
    let finishPosition = startPosition + pagesRangeDisplayed;

    if (pagesRangeDisplayed > totalPages) {
      startPosition = 1;
      finishPosition = totalPages;
    }
    // In case the pages left when component first mounted
    // are not enough for pagesRangeDisplayed
    else if (firstButtonInRange - 1 + pagesRangeDisplayed > totalPages) {
      startPosition = totalPages - pagesRangeDisplayed;
      finishPosition = startPosition + pagesRangeDisplayed;
    }

    const pageButtons = [];
    for (let i = startPosition; i < finishPosition; i++) {
      const pageButton = (
        <PaginationButton
          key={i}
          text={i}
          onClick={() => setCurrentPage(i)}
          intent={i === currentPage ? Intent.PRIMARY : Intent.NONE}
        />
      );
      pageButtons.push(pageButton);
    }

    return <>{pageButtons}</>;
  };

  return (
    <ButtonGroup>
      <PaginationButton
        text="<<"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      />
      <PaginationButton
        text="<"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      />
      <div className="footer_pagination_page-button-container">
        {renderPaginationButtons()}
      </div>
      <PaginationButton
        text=">"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
      <PaginationButton
        text=">>"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      />
    </ButtonGroup>
  );
};

export default PagePagination;
