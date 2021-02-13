import React, { ReactElement, useState, useEffect } from 'react';
import { ButtonGroup, Intent } from '@blueprintjs/core';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';
import PaginationButton from './PaginationButton';
import './Pagination.styled.scss';

interface PaginationButtonsGroup {
  totalPages: number;
  pagesRangeDisplayed?: number;
  currentPage: number;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
}

const PaginationButtonsGroup = ({
  totalPages,
  pagesRangeDisplayed = PAGINATION.PAGES_RANGE_DISPLAYED,
  currentPage,
  updateParams
}: PaginationButtonsGroup): ReactElement => {
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

  const updateCurrentPage = (newPage: number) => {
    updateParams({ currentPage: newPage });
  };

  const renderPaginationButtons = (): ReactElement => {
    let startPosition = firstButtonInRange;
    let finishPosition = startPosition + pagesRangeDisplayed;

    if (pagesRangeDisplayed > totalPages) {
      startPosition = 1;
      finishPosition = totalPages + 1;
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
          onClick={() => updateCurrentPage(i)}
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
        onClick={() => updateCurrentPage(1)}
      />
      <PaginationButton
        text="<"
        disabled={currentPage === 1}
        onClick={() => updateCurrentPage(currentPage - 1)}
      />
      <div className="footer_pagination_page-button_container">
        {renderPaginationButtons()}
      </div>
      <PaginationButton
        text=">"
        disabled={currentPage === totalPages}
        onClick={() => updateCurrentPage(currentPage + 1)}
      />
      <PaginationButton
        text=">>"
        disabled={currentPage === totalPages}
        onClick={() => updateCurrentPage(totalPages)}
      />
    </ButtonGroup>
  );
};

export default PaginationButtonsGroup;
