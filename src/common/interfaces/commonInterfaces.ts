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
  tags?: {
    language?: string;
    name?: Array<string>;
    parody?: Array<string>;
    character?: Array<string>;
    genre?: Array<string>;
    wildcard?: Array<string>;
  };
}

/**
 * Tag interfaces
 */
interface Tags {
  tagType: string;
  tagName: string;
}

export { Folder, FolderFilterParams, Tags };
