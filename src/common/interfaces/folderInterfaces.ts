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

interface FolderQueryResult {
  folders?: {
    foldersList: Array<Folder>;
    totalFolders: number;
  };
  message: string;
  status: number;
}

export { Folder, FolderFilterParams, FolderQueryResult };
