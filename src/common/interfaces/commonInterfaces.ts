import TagAction from '../enums/tagAction';

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
  CreatedAt: number;
  UpdatedAt: number;
  Tags: Record<BreakDownTagType, string[]>;
}
interface RenameFolderParams {
  oldLocation: string;
  newLocation: string;
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
interface Tag {
  tagType: BreakDownTagType;
  tagName: string;
}
interface TagRelations {
  parody_character: Record<string, string[]>;
  author_parody: Record<string, string[]>;
  author_genre: Record<string, string[]>;
}
interface ModifyTagsOfFolders {
  folderLocations: string[];
  existingTags: Tag[];
  newTags: Tag[];
  category?: string | null;
  language?: string | null;
  action: TagAction;
}
interface ManagedTag extends Tag {
  usedTimes: number;
}
interface ManageTagsFilterParams {
  filterBy: BreakDownTagType;
}
interface UpdatedTag {
  tagType: BreakDownTagType;
  oldValue: string;
  newValue: string;
}

export {
  Folder,
  FolderFilterParams,
  RenameFolderParams,
  TransferData,
  BreakDownTagType,
  SearchTagType,
  Tag,
  TagRelations,
  ModifyTagsOfFolders,
  ManagedTag,
  ManageTagsFilterParams,
  UpdatedTag
};
