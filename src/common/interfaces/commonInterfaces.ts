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
    name?: string[];
    author?: string[];
    parody?: string[];
    character?: string[];
    genre?: string[];
    wildcard?: string[];
  };
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
interface Tag {
  tagType: string;
  tagName: string;
}
interface TagRelations {
  parody_character: Record<string, string[]>;
  author_parody: Record<string, string[]>;
  author_genre: Record<string, string[]>;
}

export {
  Folder,
  FolderFilterParams,
  TransferData,
  BreakDownTagType,
  Tag,
  TagRelations
};
