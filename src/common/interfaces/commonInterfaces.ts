/**
 * Folder interfaces
 */
interface Folder {
  location: string;
  name: string;
  thumbnail?: string;
}
interface FolderFilterParams {
  currentPage: number;
  itemsPerPage: number;
  isRandom?: boolean;
  category?: string;
  language?: string;
  tags?: Partial<Record<SearchTagType, string[]>>;
}
interface TransferData {
  FolderLocation: string;
  FolderName: string;
  Category: string;
  Language: string;
  Tags: Record<BreakDownTagType, string[]>;
}

/**
 * Tag interfaces
 */
type BreakDownTagType = 'author' | 'parody' | 'character' | 'genre';
type SearchTagType =
  | 'name'
  | 'author'
  | 'parody'
  | 'character'
  | 'genre'
  | 'wildcard';
type ManageTagsSortType = 'Tag Name' | 'Used Times';
interface Tag {
  tagType: string;
  tagName: string;
}
interface TagRelations {
  parody_character: Record<string, string[]>;
  author_parody: Record<string, string[]>;
  author_genre: Record<string, string[]>;
}
interface ManagedTag extends Tag {
  usedTimes: number;
}
interface ManageTagsFilterParams {
  filterBy: BreakDownTagType;
  sortBy: ManageTagsSortType;
}

export {
  Folder,
  FolderFilterParams,
  TransferData,
  BreakDownTagType,
  SearchTagType,
  Tag,
  TagRelations,
  ManagedTag,
  ManageTagsSortType,
  ManageTagsFilterParams
};
