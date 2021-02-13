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
  tags?: {
    name?: Array<string>;
    author?: Array<string>;
    parody?: Array<string>;
    character?: Array<string>;
    genre?: Array<string>;
    wildcard?: Array<string>;
  };
}
interface TransferData {
  FolderLocation: string;
  FolderName: string;
  Category: string;
  Language: string;
  Tags: Record<BreakDownTagsType, Array<string>>;
}

/**
 * Tag interfaces
 */
type BreakDownTagsType = 'author' | 'parody' | 'character' | 'genre';
interface Tags {
  tagType: string;
  tagName: string;
}
interface TagRelations {
  parody_character: Record<string, Array<string>>;
  author_parody: Record<string, Array<string>>;
  author_genre: Record<string, Array<string>>;
}

export {
  Folder,
  FolderFilterParams,
  TransferData,
  BreakDownTagsType,
  Tags,
  TagRelations
};
