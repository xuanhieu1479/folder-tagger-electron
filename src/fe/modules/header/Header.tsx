import React, { ReactElement } from 'react';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { CustomSuggest } from '../../components/commonComponents';
import './Header.styled.scss';

interface HeaderInterface {
  params: FolderFilterParams;
  updateParams: (newParams: FolderFilterParams) => void;
  allCategories: Array<string>;
}
const allOption = 'all';

const Header = ({
  params,
  updateParams,
  allCategories
}: HeaderInterface): ReactElement => {
  const onChangeCategory = (newCategory: string) => {
    updateParams({
      ...params,
      category: newCategory === allOption ? undefined : newCategory
    });
  };

  return (
    <header className="header_container">
      <section className="header_category_container">
        <div>Category:</div>
        <CustomSuggest
          selectedItem={params.category || allOption}
          items={[allOption, ...allCategories]}
          updateSelectedItem={onChangeCategory}
        />
      </section>
    </header>
  );
};

export default Header;
