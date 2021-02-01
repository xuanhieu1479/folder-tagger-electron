import React, { ReactElement, useState } from 'react';
import _ from 'lodash';
import { InputGroup, Button, Intent } from '@blueprintjs/core';
import { FolderFilterParams } from '../../../common/interfaces/commonInterfaces';
import { PAGINATION, SEARCH } from '../../../common/variables/commonVariables';
import { CustomSuggest } from '../../components/commonComponents';
import './Header.styled.scss';

interface HeaderInterface {
  params: FolderFilterParams;
  updateParams: (newParams: Partial<FolderFilterParams>) => void;
  allCategories: Array<string>;
  allLanguages: Array<string>;
}
type TagKeyType =
  | 'name'
  | 'artist'
  | 'group'
  | 'parody'
  | 'character'
  | 'genre'
  | 'wildcard';
const allOption = 'all';
const {
  COMMON_TERMS,
  END_OF_TAGS_CHARACTER,
  MINIMUM_LETTERS,
  TAG_KEYS
} = SEARCH;
const alternativeEndOfTagsRegex = `(${TAG_KEYS.map(
  (tagKey, index) => `${index > 0 ? '|' : ''}${tagKey}:`
).join('')})`;

const Header = ({
  params,
  updateParams,
  allCategories,
  allLanguages
}: HeaderInterface): ReactElement => {
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
    const tags = generateTagsFromSearchKeywords();
    updateParams({ tags, ...PAGINATION.DEFAULT });
  };
  const onRandomize = () => {
    // updateParams({
    //   currentPage: PAGINATION.DEFAULT.currentPage,
    //   isRandom: true
    // });
  };

  const sanitizeSearchKeywords = (
    searchQuery: string,
    miniMumLetters = MINIMUM_LETTERS
  ) => {
    return [
      ...new Set(
        searchQuery
          .trim()
          .replace(/\s+/, ' ')
          .split(' ')
          .filter(
            tag => tag.length >= miniMumLetters && !COMMON_TERMS.includes(tag)
          )
      )
    ];
  };

  const generateTagsFromSearchKeywords = () => {
    let searchQuery = searchKeywords;
    const tags: Partial<Record<TagKeyType, Array<string>>> = {};
    const getTagsByTagKeyFromSearchKeywords = (tagKey: string) => {
      const tagKeyRegex = `${tagKey}:`;
      const searchRegex = new RegExp(
        `(?<=${tagKeyRegex})(.*?)(?=(\\${END_OF_TAGS_CHARACTER}|${alternativeEndOfTagsRegex}|$))`,
        'gi'
      );
      searchQuery = searchQuery
        .replace(searchRegex, match => {
          switch (tagKey) {
            case 'parody':
            case 'character':
              tags[tagKey] = sanitizeSearchKeywords(match, 2);
              break;
            case 'name':
            case 'artist':
            case 'group':
            case 'genre':
              tags[tagKey] = sanitizeSearchKeywords(match);
              break;
          }
          return '';
        })
        .replace(tagKeyRegex, '');
    };

    TAG_KEYS.forEach(tagKey => getTagsByTagKeyFromSearchKeywords(tagKey));
    const wildcardTags = sanitizeSearchKeywords(
      searchQuery.replace(END_OF_TAGS_CHARACTER, '')
    );
    if (!_.isEmpty(wildcardTags)) tags['wildcard'] = wildcardTags;
    return tags;
  };

  return (
    <header className="header_container">
      <section className="header_select_container">
        <div className="header_select_label">Category:</div>
        <CustomSuggest
          selectedItem={params.category || allOption}
          items={[allOption, ...allCategories]}
          className="header_select-category"
          updateSelectedItem={onChangeCategory}
        />
        <div className="header_select_label">Language:</div>
        <CustomSuggest
          selectedItem={params.language || allOption}
          items={[allOption, ...allLanguages]}
          className="header_select-language"
          updateSelectedItem={onChangeLanguage}
        />
      </section>
      <InputGroup
        className="header_keyword-input"
        placeholder="Search Keywords"
        value={searchKeywords}
        onChange={onChangeSearchKeywords}
        onKeyDown={onPressEnter}
      />
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