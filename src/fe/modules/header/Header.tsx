import React, { ReactElement, useState } from 'react';
import { InputGroup, Button, Intent, Icon, Tooltip } from '@blueprintjs/core';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import {
  PAGINATION,
  SEARCH,
  ELEMENT_ID
} from '../../../common/variables/commonVariables';
import { CustomSuggest } from '../../components/commonComponents';
import { generateTagsFromSearchKeywords } from '../../../utilities/feUtilities';
import './Header.styled.scss';

interface Header {
  params: FolderFilterParams;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
  allCategories: string[];
  allLanguages: string[];
}
const allOption = 'all';
const noneOption = 'none';

const Header = ({
  params,
  updateParams,
  allCategories,
  allLanguages
}: Header): ReactElement => {
  const [searchKeywords, setSearchKeywords] = useState('');

  const onChangeCategory = (newCategory: string) => {
    updateParams({
      category: newCategory === allOption ? undefined : newCategory
    });
  };
  const onChangeLanguage = (newLanguage: string) => {
    updateParams({
      language: newLanguage === allOption ? undefined : newLanguage
    });
  };
  const onChangeSearchKeywords = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchKeywords(event.currentTarget.value);
  };
  const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onSearch();
  };

  const onSearch = () => {
    const tags = generateTagsFromSearchKeywords(searchKeywords);
    updateParams({ tags, isRandom: false, ...PAGINATION.DEFAULT });
  };
  const onRandomize = () => {
    const tags = generateTagsFromSearchKeywords(searchKeywords);
    updateParams({ tags, isRandom: true, ...PAGINATION.DEFAULT });
  };

  return (
    <header className="header_container">
      <section className="header_select_container">
        <div className="header_select_label">Category:</div>
        <CustomSuggest
          inputId={ELEMENT_ID.HEADER_INPUT('category')}
          selectedItem={params.category || allOption}
          items={[allOption, ...allCategories, noneOption]}
          className="header_select-category"
          updateSelectedItem={onChangeCategory}
        />
        <div className="header_select_label">Language:</div>
        <CustomSuggest
          inputId={ELEMENT_ID.HEADER_INPUT('language')}
          selectedItem={params.language || allOption}
          items={[allOption, ...allLanguages, noneOption]}
          className="header_select-language"
          updateSelectedItem={onChangeLanguage}
        />
      </section>
      <section className="header_keyword-input_container">
        <InputGroup
          id={ELEMENT_ID.HEADER_INPUT('search')}
          className="header_keyword-input"
          placeholder="Search Keywords"
          value={searchKeywords}
          onChange={onChangeSearchKeywords}
          onKeyDown={onPressEnter}
        />
        <Tooltip
          intent={Intent.PRIMARY}
          content={
            <div className="header_keyword-icon_tooltip">
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NO_AUTHOR}" to get folders that have no author.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NO_PARODY}" to get folders that have no parody.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NO_GENRE}" to get folders that have no genre.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.HAVE_CHARACTER}" to get folders that have at least one character.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.MANY_PARODIES}" to get folders that have multiple parodies.`}</div>
            </div>
          }
        >
          <Icon
            icon="help"
            intent={Intent.PRIMARY}
            className="header_keyword-icon"
          />
        </Tooltip>
      </section>
      <div className="header_action-buttons">
        <Button intent={Intent.PRIMARY} onClick={onRandomize}>
          Randomize
        </Button>
        <Button intent={Intent.SUCCESS} onClick={onSearch}>
          Search
        </Button>
      </div>
    </header>
  );
};

export default Header;
