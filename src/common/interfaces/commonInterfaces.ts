/**
 * General interfaces
 */
interface LooseObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Folder interfaces
 */
interface Folder {
  location: string;
  name: string;
  thumbnail?: string;
}
interface FolderFilterParams {
  currentPage?: number;
  itemsPerPage?: number;
  name?: string;
  category?: string;
  language?: string;
  tag?: [
    {
      tagType: string;
      tagName: string;
    }
  ];
}

export { LooseObject, Folder, FolderFilterParams };
