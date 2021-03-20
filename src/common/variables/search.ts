const SEARCH = {
  END_OF_TAGS_CHARACTER: '$',
  EXCLUDE_TAGS_CHARACTER: '-',
  ABSOLUTE_TAGS_CHARACTER: '"',
  COMMON_TERMS: ['the'],
  MINIMUM_LETTERS: 3,
  TAG_KEYS: ['name', 'author', 'parody', 'character', 'genre'],
  SPECIAL_TAGS: {
    NO: 'no_',
    HAVE: 'have_',
    MANY: 'many_',
    NEWLY_UPDATED: 'newly_updated',
    NEWLY_ADDED: 'newly_added'
  }
};

export default SEARCH;
