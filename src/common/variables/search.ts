const SEARCH = {
  END_OF_TAGS_CHARACTER: '$',
  EXCLUDE_TAGS_CHARACTER: '-',
  COMMON_TERMS: ['the'],
  MINIMUM_LETTERS: 3,
  TAG_KEYS: ['name', 'language', 'author', 'parody', 'character', 'genre'],
  SPECIAL_TAGS: {
    NO_AUTHOR: 'no_author',
    NO_TAG: 'no_tag',
    MANY_PARODIES: 'many_parody'
  }
};

export default SEARCH;
