import React, { ReactElement, useState } from 'react';
import { InputGroup, Button, Intent } from '@blueprintjs/core';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION } from '../../../common/variables/commonVariables';
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
  const [searchKeywords, setSearchKeywords] = useState('');

  const onChangeCategory = (newCategory: string) => {
    updateParams({
      category: newCategory === allOption ? undefined : newCategory
    });
  };
  const onChangeSearchKeywords = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchKeywords(event.currentTarget.value);
  };

  const onSearch = () => {
    updateParams({
      currentPage: PAGINATION.DEFAULT.currentPage,
      isRandom: false,
      tag: [{ tagType: 'genre', tagName: 'mind control' }]
    });
  };
  const onRandomize = () => {
    updateParams({
      currentPage: PAGINATION.DEFAULT.currentPage,
      isRandom: true,
      tag: [{ tagType: 'genre', tagName: 'mind control' }]
    });
  };

  return (
    <header className="header_container">
      <section className="header_category_container">
        <div className="header_category_label">Category:</div>
        <CustomSuggest
          selectedItem={params.category || allOption}
          items={[allOption, ...allCategories]}
          updateSelectedItem={onChangeCategory}
        />
      </section>
      <InputGroup
        className="header_category_keyword-input"
        placeholder="Search Keywords"
        value={searchKeywords}
        onChange={onChangeSearchKeywords}
      />
      <div className="header_category_action-buttons">
        <Button intent={Intent.PRIMARY} onClick={onSearch}>
          Randomize
        </Button>
        <Button intent={Intent.SUCCESS} onClick={onRandomize}>
          Search
        </Button>
      </div>
    </header>
  );
};

export default Header;
