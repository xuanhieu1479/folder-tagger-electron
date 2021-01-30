import React, { ReactElement, ChangeEvent } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';

interface PaginationOptionsInterface {
  itemsPerPage: number;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
}

const PaginationOptions = ({
  itemsPerPage,
  updateParams
}: PaginationOptionsInterface): ReactElement => {
  const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    updateParams({
      currentPage: PAGINATION.DEFAULT.currentPage,
      itemsPerPage: parseInt(event.target.value)
    });
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
