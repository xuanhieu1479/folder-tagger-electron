import React, { ReactElement } from 'react';
import { InputGroup, Button, Intent, Icon, Tooltip } from '@blueprintjs/core';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import {
  PAGINATION,
  SEARCH,
  ELEMENT_ID
} from '../../../common/variables/commonVariables';
import { CustomSuggest } from '../../components/commonComponents';
import './Header.styled.scss';

interface Header {
  params: FolderFilterParams;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
  getNewFolders: () => void;
  searchKeywords: string;
  onChangeSearchKeywords: (event: React.FormEvent<HTMLInputElement>) => void;
  allCategories: string[];
  allLanguages: string[];
}
const allOption = 'all';
const noneOption = 'none';

const Header = ({
  params,
  updateParams,
  getNewFolders,
  searchKeywords,
  onChangeSearchKeywords,
  allCategories,
  allLanguages
}: Header): ReactElement => {
  const onChangeCategory = (newCategory: string) => {
    updateParams({
      category: newCategory === allOption ? undefined : newCategory,
      ...PAGINATION.DEFAULT
    });
  };
  const onChangeLanguage = (newLanguage: string) => {
    updateParams({
      language: newLanguage === allOption ? undefined : newLanguage,
      ...PAGINATION.DEFAULT
    });
  };
  const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      getNewFolders();
    }
  };

  const turnOffRandom = () => {
    updateParams({ isRandom: false, ...PAGINATION.DEFAULT });
  };
  const turnOnRandom = () => {
    updateParams({ isRandom: true, ...PAGINATION.DEFAULT });
  };

  return (
    <header className="header_container">
      <section className="header_select_container">
        <div className="header_select_label">Category:</div>
        <CustomSuggest
          inputId={ELEMENT_ID.HEADER_CATEGORY_SELECT}
          selectedItem={params.category || allOption}
          items={[allOption, ...allCategories, noneOption]}
          className="header_select-category"
          updateSelectedItem={onChangeCategory}
        />
        <div className="header_select_label">Language:</div>
        <CustomSuggest
          inputId={ELEMENT_ID.HEADER_LANGUAGE_SELECT}
          selectedItem={params.language || allOption}
          items={[allOption, ...allLanguages, noneOption]}
          className="header_select-language"
          updateSelectedItem={onChangeLanguage}
        />
      </section>
      <section className="header_keyword-input_container">
        <InputGroup
          id={ELEMENT_ID.HEADER_SEARCH_INPUT}
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
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NO}[tag type]" to get folders that don't have tags with specific tag type.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.HAVE}[tag type]" to get folders that have tags with specific tag type.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.MANY}[tag type]" to get folders that have many tags with specific tag type.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NEWLY_ADDED}" to get folders that just have been added.`}</div>
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NEWLY_UPDATED}" to get folders that just have been updated.`}</div>
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
        <Button intent={Intent.PRIMARY} onClick={turnOnRandom}>
          Randomize
        </Button>
        <Button intent={Intent.SUCCESS} onClick={turnOffRandom}>
          Search
        </Button>
      </div>
    </header>
  );
};

export default Header;
