const SEARCH = {
  END_OF_TAGS_CHARACTER: '$',
  EXCLUDE_TAGS_CHARACTER: '-',
  COMMON_TERMS: ['the'],
  MINIMUM_LETTERS: 3,
  TAG_KEYS: ['name', 'language', 'parody', 'character', 'genre'],
  SPECIAL_TAGS: {
    NO_ARTIST: 'no_artist',
    NO_GROUP: 'no_group',
    NO_TAG: 'no_tag'
  }
};

export default SEARCH;
