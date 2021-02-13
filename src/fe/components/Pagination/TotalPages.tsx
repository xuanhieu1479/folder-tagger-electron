import React, { ReactElement } from 'react';

interface TotalPages {
  totalFolders: number;
}

const TotalPages = ({ totalFolders }: TotalPages): ReactElement => {
  return (
    <section className="footer_pagination_total-folders">
      Total folders found: {totalFolders}
    </section>
  );
};

export default TotalPages;
