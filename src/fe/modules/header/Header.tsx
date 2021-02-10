import React, { ReactElement, useState } from 'react';
import _ from 'lodash';
import { InputGroup, Button, Intent, Icon, Tooltip } from '@blueprintjs/core';
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
  | 'author'
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
    updateParams({ tags, isRandom: false, ...PAGINATION.DEFAULT });
  };
  const onRandomize = () => {
    const tags = generateTagsFromSearchKeywords();
    updateParams({ tags, isRandom: true, ...PAGINATION.DEFAULT });
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
            case 'author':
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
      <section className="header_keyword-input_container">
        <InputGroup
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
              <div>{`Use "${SEARCH.SPECIAL_TAGS.NO_TAG}" to get folders that have no tag (except author).`}</div>
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
