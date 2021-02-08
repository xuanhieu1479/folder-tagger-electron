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
    parody?: Array<string>;
    character?: Array<string>;
    genre?: Array<string>;
    wildcard?: Array<string>;
  };
}
interface TransferDataInterface {
  FolderLocation: string;
  FolderName: string;
  Category: string;
  Language: string;
  Tags: {
    artist: Array<string>;
    parody: Array<string>;
    character: Array<string>;
    genre: Array<string>;
  };
}

/**
 * Tag interfaces
 */
interface Tags {
  tagType: string;
  tagName: string;
}

export { Folder, FolderFilterParams, TransferDataInterface, Tags };
