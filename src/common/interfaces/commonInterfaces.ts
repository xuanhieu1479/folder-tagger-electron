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
    artist?: Array<string>;
    group?: Array<string>;
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
