import React, { ReactElement, ChangeEvent } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { PAGINATION } from '../../../common/variables/commonVariables';

interface PaginationOptionsInterface {
  itemsPerPage: number;
  setItemsPerPage: (quantity: number) => void;
  setCurrentPage: (page: number) => void;
}

const PaginationOptions = ({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage
}: PaginationOptionsInterface): ReactElement => {
  const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    setItemsPerPage(parseInt(event.target.value));
  };

  return (
    <section className="footer_pagination_pagination_options">
      <span>{'Show'}</span>
      <HTMLSelect
        value={itemsPerPage}
        minimal={true}
        onChange={onChangeSelect}
        className="footer_pagination_pagination_options"
        options={PAGINATION.ITEMS_PER_PAGE.map(quantity => {
          return { value: quantity };
        })}
      />
      <span>{'folders each page'}</span>
    </section>
  );
};

export default PaginationOptions;
