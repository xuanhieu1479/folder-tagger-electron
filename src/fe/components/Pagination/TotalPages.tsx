import React, { ReactElement } from 'react';

interface TotalPagesInterface {
  totalFolders: number;
}

const TotalPages = ({ totalFolders }: TotalPagesInterface): ReactElement => {
  return (
    <section className="footer_pagination_total-folders">
      Total folders found: {totalFolders}
    </section>
  );
};

export default TotalPages;
